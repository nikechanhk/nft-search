/* eslint-disable max-len */
import axios from 'axios';
import _ from 'lodash';
import { PrismaClient } from '@prisma/client';

const raritysniper = async (collectionName: string) => {
    const prisma = new PrismaClient();
    let result: { id: string; rank: number }[] = [];

    let page = 1;
    while (true) {
        const data = JSON.stringify({
            searches: [
                {
                    query_by:
                        'trait_atmosphere,trait_background,trait_character,trait_face,trait_feet,trait_hands,trait_head,trait_leg,trait_ranking,trait_shoulder,trait_skin,trait_special,trait_neck,trait_trinket,trait_waist,trait_weapon,trait_wrist',
                    sort_by: 'rank:asc,nftId:asc',
                    highlight_full_fields:
                        'trait_atmosphere,trait_background,trait_character,trait_face,trait_feet,trait_hands,trait_head,trait_leg,trait_ranking,trait_shoulder,trait_skin,trait_special,trait_neck,trait_trinket,trait_waist,trait_weapon,trait_wrist',
                    collection: collectionName,
                    q: '*',
                    facet_by:
                        'trait_atmosphere,trait_background,trait_character,trait_face,trait_feet,trait_hands,trait_head,trait_leg,trait_ranking,trait_shoulder,trait_skin,trait_special,trait_neck,trait_trinket,trait_waist,trait_weapon,trait_wrist,trait_traits-count,nftId,forSale,sortPrice,rank',
                    max_facet_values: 1000,
                    page: page,
                    per_page: 200,
                },
            ],
        });

        const apiResult = await axios({
            method: 'post',
            url: 'https://search2.raritysniper.com/multi_search?x-typesense-api-key=L1NoMW9ITm1SYWNodFk4cWpmaHphQWZTS2tuaTVFWDNGdmxjT1llcEpLdz1uNWhMeyJmaWx0ZXJfYnkiOiJwdWJsaXNoZWQ6dHJ1ZSJ9',
            headers: {
                Host: 'search2.raritysniper.com',
                'User-Agent':
                    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:100.0) Gecko/20100101 Firefox/100.0',
                Accept: 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.5',
                Origin: 'https://raritysniper.com',
                Referer: 'https://raritysniper.com/',
                Connection: 'keep-alive',
                'Content-Type': 'application/json',
            },
            data: data,
        }).then(function (response) {
            console.log(response.data);
            const hits = _.get(response.data, 'results[0].hits');

            const mapHits = hits.map((obj: unknown) => {
                return {
                    id: _.get(obj, 'document.id'),
                    rank: _.get(obj, 'document.rank'),
                };
            });
            return mapHits;
        });

        console.log(apiResult);
        result = [...result, ...apiResult];

        if ((apiResult as Array<unknown>).length === 0) {
            break;
        } else {
            page++;
        }
    }

    console.log('end');
    console.log(result.length);

    try {
        for (const r of result) {
            await prisma.rank.create({
                data: {
                    projId: collectionName,
                    itemId: r.id,
                    rank: r.rank,
                    traits: '',
                },
            });
            console.log('create record', r.id, r.rank);
        }
    } catch (e) {
        console.log('error', e);
    } finally {
        await prisma.$disconnect();
    }
};

(async () => {
    await raritysniper('assets_clementine-s-nightmare');
})();
