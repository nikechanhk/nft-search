import { TG_KEY } from './tg';
import telegram from 'node-telegram-bot-api';
import Prisma from '@prisma/client';
import resultFormat from './result-format';
import { OpenSeaStreamClient } from '@opensea/stream-js';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import moment from 'moment';
import constant from './constant';
import _ from 'lodash';

const { PrismaClient } = Prisma;

export const onItemListed = (params: {
    collectionSlug: string;
    projId?: string;
    osClient: OpenSeaStreamClient;
    chatId: string;
    nftFilter: (params: {
        floorPrice: number;
        nftPrice: number;
        rank?: number;
        traits?: any;
    }) => boolean;
    address: string;
}) => {
    const { collectionSlug, osClient, nftFilter, projId, chatId, address } =
        params;

    osClient.onItemListed(collectionSlug, async (event) => {
        // handle event
        if (event.payload.is_private === true) {
            return;
        }

        const prisma = new PrismaClient();
        try {
            // fp
            axiosRetry(axios, { retries: 5 });
            const collectionData = await axios.get(
                `https://api.opensea.io/api/v1/collection/${collectionSlug}`,
                {
                    headers: {
                        'X-API-KEY': constant.openseaToken,
                    },
                },
            );
            const fp = _.toNumber(
                _.get(collectionData, 'data.collection.stats.floor_price'),
            );
            const collectionAddress = _.get(
                collectionData,
                'data.collection.primary_asset_contracts[0].address',
            );

            const bot = new telegram(TG_KEY);

            const link = event.payload.item.permalink;
            const array = link.split('/');
            const nftId = _.last(array);
            if (nftId == null) {
                return;
            }
            const basePrice = _.toNumber(event.payload.base_price);
            const price =
                basePrice / Math.pow(10, event.payload.payment_token.decimals);

            const item = {
                id: nftId,
                price: price,
            };

            let rank: Prisma.Rank | null = null;

            if (projId != null) {
                rank = await prisma.rank.findFirst({
                    where: {
                        projId: projId,
                        itemId: item.id,
                    },
                });
            }

            const itemData = await axios
                .get(
                    `https://api.opensea.io/api/v1/asset/${collectionAddress}/${item.id}/?include_orders=false`,
                    {
                        headers: {
                            'X-API-KEY': constant.openseaToken,
                        },
                    },
                )
                .catch((e) => {
                    console.log(e);
                    return {};
                });
            const imageUrl = _.get(itemData, 'data.image_thumbnail_url', '');
            let traits = _.get(itemData, 'data.traits', null);
            if (traits != null && _.isArray(traits)) {
                traits = _.keyBy(traits, 'trait_type');
            }

            const result = {
                ...item,
                rank: rank != null ? rank?.rank : undefined,
                traits,
            };

            console.log('collection: ', collectionSlug);
            console.log('result: ', _.omit(result, 'traits'));

            const filterResult = nftFilter({
                floorPrice: fp,
                nftPrice: result.price,
                rank: result.rank,
                traits: result.traits,
            });

            if (filterResult === false) {
                return;
            }

            // last transfer
            const apiData = await axios.get(
                `https://api.opensea.io/api/v1/events`,
                {
                    headers: {
                        'X-API-KEY': constant.openseaToken,
                    },
                    params: {
                        only_opensea: false,
                        token_id: nftId,
                        asset_contract_address: address,
                        collection_slug: collectionSlug,
                        event_type: 'transfer',
                    },
                },
            );
            const events = _.get(apiData, 'data.asset_events');
            let lastTransfer = 'null';
            if (_.isArray(events) && (events as Array<unknown>).length > 0) {
                const e = events[0];
                const ts = _.get(e, 'event_timestamp');
                const eventMoment = moment(`${ts}+0000`);
                lastTransfer = eventMoment.fromNow();
                console.log(lastTransfer);

                const diff = moment().diff(eventMoment, 'minutes');
                if (diff <= 30) {
                    lastTransfer = `⚠️⚠️⚠️⚠️${lastTransfer}⚠️⚠️⚠️⚠️`;
                }
            }

            const resultWithFormat = resultFormat([result]);
            const metaLink = `https://metamask.app.link/dapp/${link.replace(
                'https://',
                '',
            )}`;
            if (chatId != null && resultWithFormat.length > 0) {
                const currentUTCHour = moment().utc().hour();
                const disableNotif =
                    currentUTCHour >= 16 && currentUTCHour <= 23;

                bot.sendMessage(
                    chatId,
                    // eslint-disable-next-line max-len
                    `fp: ${fp}\n${resultWithFormat}\nLast Transfer: ${lastTransfer}\n\n${imageUrl}\n\n${link}\n\n${metaLink}`,
                    {
                        disable_notification: disableNotif,
                    },
                );
            }
        } catch (e) {
            console.log('error', e);
        } finally {
            await prisma.$disconnect();
        }
    });
};
