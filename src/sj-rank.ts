import axios from 'axios';
import _ from 'lodash';
import { PrismaClient } from '@prisma/client';

const sjRank = async () => {
    const apiResult = await axios
        .get(
            'https://shonenjunk.xyz/_next/data/TE3Hj5ZyIAiab4Sv85ypo/unit-00/gallery.json',
        )
        .then((resp) => resp.data);

    const hits = _.get(apiResult, 'pageProps.allAvatarMetadata');
    const mappedHits = hits.map((obj: unknown) => {
        return {
            id: _.toString(_.get(obj, 'tokenId')),
            rank: _.get(obj, 'rarity.rank'),
        };
    });

    console.log('length', (mappedHits as Array<unknown>).length);

    const prisma = new PrismaClient();

    try {
        for (const r of mappedHits) {
            await prisma.rank.create({
                data: {
                    projId: 'shonen-junk-official',
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
    await sjRank();
})();
