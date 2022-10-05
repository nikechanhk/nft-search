import puppeteer from 'puppeteer';
import _ from 'lodash';
import { PrismaClient } from '@prisma/client';

const rankLookup = async (projId: string) => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const prisma = new PrismaClient();

    try {
        const page = await browser.newPage();
        await page.goto(`https://rarity.tools/${projId}/`);

        let resultArray: { id: string; rank: number }[] = [];
        while (true) {
            for (let j = 0; j < 6; j++) {
                await page.waitForTimeout(2 * 1000);

                const rankContainerSelector = await page.$('.justify-start');
                const rankItemElements = await rankContainerSelector?.$$(
                    '.border.overflow-hidden.transform',
                );

                if (rankItemElements == null) {
                    console.log('cannot find rank item container');
                    continue;
                }

                const resultOfPage: { id: string; rank: number }[] = [];
                for (const rankItemElement of rankItemElements) {
                    let rank = '';
                    let idOfItem = '';

                    const rankString = await rankItemElement.$eval(
                        '.flex-grow.font-extrabold',
                        (node) => (<HTMLElement>node).title,
                    );

                    const idString = await rankItemElement.$eval(
                        'div.text-sm.font-bold.overflow-ellipsis > a:nth-child(1)',
                        (node) => (<HTMLElement>node).innerText,
                    );

                    if (rankString != null && typeof rankString === 'string') {
                        rank = (rankString as string).replace('#', '');
                    }

                    const idStringArray =
                        idString != null && typeof idString === 'string'
                            ? (idString as string).split('#')
                            : [];
                    if (idStringArray.length > 1) {
                        idOfItem = idStringArray[1];
                    }

                    if (rank !== '') {
                        resultOfPage.push({
                            id: idOfItem,
                            rank: _.toNumber(rank),
                        });
                    }
                }

                console.log('total resultOfPage', resultOfPage.length);
                console.log('test result', JSON.stringify(resultOfPage[0]));
                resultArray = [...resultArray, ...resultOfPage];
                break;
            }

            // next page
            const btnsSelector = await page.$$(
                'div.flex:nth-child(9) > div:nth-child(3) > .select-none.smallBtn',
            );

            let hitIndex = -1;
            for (let k = 0; k < btnsSelector.length; k++) {
                const btnSelector = btnsSelector[k];
                const innerText = await btnSelector.evaluate(
                    (node) => (<HTMLElement>node).innerText,
                );

                if (typeof innerText === 'string' && innerText === 'Next >') {
                    hitIndex = k;
                    break;
                }
            }

            if (hitIndex != -1) {
                await btnsSelector[hitIndex].click();
                console.log('click next btn');
                await page.waitForTimeout(0.5 * 1000);
            } else {
                console.log('cannot find next btn. should be the end');
                break;
            }
        }

        console.log('total result', resultArray.length);

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
        await browser.close();
        await prisma.$disconnect();
    }
};

rankLookup('duskbreakers');

export { rankLookup };
