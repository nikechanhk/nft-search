import _ from 'lodash';
import { PrismaClient } from '@prisma/client';
import badFaceBotsJson from './raritysniffer-data.json';

const rankLookup = async (projId: string) => {
    const prisma = new PrismaClient();

    const resultArray = (_.get(badFaceBotsJson, 'data') as any[]).map(
        (result) => {
            return {
                id: _.toString(result.id),
                rank: result.positionId,
                traits: '',
            };
        },
    );

    try {
        for (const result of resultArray) {
            await prisma.rank.create({
                data: {
                    projId: projId,
                    itemId: result.id,
                    rank: result.rank,
                    traits: '',
                },
            });
            console.log('create record', result.id, result.rank);
        }
    } catch (e) {
        console.log('error', e);
    } finally {
        await prisma.$disconnect();
    }
};

rankLookup('dreamlandgenesisproject');

export { rankLookup };
