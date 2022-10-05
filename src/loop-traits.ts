import _ from 'lodash';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const loopTraits = async (projectAddress: string, projId: string) => {
    let result: unknown[] = [];

    for (let i = 0; ; i += 50) {
        // eslint-disable-next-line max-len
        const url = `https://api.opensea.io/api/v1/assets?asset_contract_address=${projectAddress}&offset=${i}&limit=50`;
        const resp = await axios({
            method: 'get',
            url: url,
            headers: {
                'X-API-KEY': '02be7d077a324aefa5f534abc76d5678',
                Accept: 'application/json',
            },
        }).catch(function (error) {
            console.log('error at:', url);
            return null;
        });

        if (resp == null) {
            console.log('error at:', url);
            continue;
        }

        const assets = _.get(resp, 'data.assets') as any[];

        if (assets == null || _.isArray(assets) === false) {
            console.log('wrong format at:', url);
            continue;
        }

        if (assets.length === 0) {
            console.log('empty resp');
            console.log('stop at:', url);
            break;
        }

        const mappedAssets = assets.map((asset) => {
            return {
                id: _.get(asset, 'token_id'),
                traits: _.get(asset, 'traits'),
            };
        });

        console.log('s: ', url);

        result = [...result, ...mappedAssets];

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(0);
            }, 0.5 * 1000);
        });
    }

    const prisma = new PrismaClient();

    try {
        for (const asset of result) {
            try {
                const traitsString = JSON.stringify(_.get(asset, 'traits'));
                const itemId = _.toNumber(_.get(asset, 'id'));

                // eslint-disable-next-line max-len
                await prisma.$executeRaw`UPDATE Rank SET traits = ${traitsString} WHERE projId = ${projId} AND itemId = ${itemId}`.catch(
                    (e) => {
                        console.log(e, 2);
                    },
                );

                console.log('update id', _.get(asset, 'id'));
            } catch (e) {
                console.log(e, 1);
            }
        }
    } catch (e) {
        console.log(e);
    } finally {
        await prisma.$disconnect();
    }
};

(async () => {
    await loopTraits(
        '0xa5c0bd78d1667c13bfb403e2a3336871396713c5',
        'coolmans-universe',
    );
})();
