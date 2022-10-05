import puppeteer from 'puppeteer';
import _ from 'lodash';
import { PrismaClient } from '@prisma/client';

const rankLookup = async (projId: string) => {
    const browser = await puppeteer.launch({ headless: false });
    const prisma = new PrismaClient();

    try {
        const page = await browser.newPage();
        await page.goto(`https://nftgo.io/collection/${projId}/rarity`);

        await page.waitForTimeout(3 * 1000);
        await page.mouse.wheel({
            deltaX: 200,
            deltaY: 2500,
        });

        let resultArray: { id: string; rank: number }[] = [];
        while (true) {
            for (let j = 0; j < 6; j++) {
                await page.waitForTimeout(2 * 1000);

                const rankContainerSelector = await page.$(
                    '.rarity-table_list__3vyaI',
                );
                const rankItemElements = await rankContainerSelector?.$$(
                    '.rarity-card_card__3WFyI.rarity-table_item__3U9-Y',
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
                        '.rarity-card_rank__1JXcc',
                        (node) => (<HTMLElement>node).innerText,
                    );

                    const idString = await rankItemElement.$eval(
                        '.text_text__1MBDK.rarity-card_name__3uTBc',
                        (node) => (<HTMLElement>node).innerText,
                    );

                    if (rankString != null && typeof rankString === 'string') {
                        rank = (rankString as string).replace('#', '');
                        rank = (rank as string).replace(',', '');
                        rank = (rank as string).replace(' ', '');
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
            const currentPageSelector = await page.$(
                '.rank-pagination_rankPaginationNumber__1t1Pc.rank-pagination_active__3E9Tk',
            );
            const currentPage = await currentPageSelector?.evaluate(
                (element) => (<HTMLElement>element).innerText,
            );

            console.log('current page', currentPage);

            if (typeof currentPage === 'string' && currentPage !== '445') {
                await page.mouse.click(711, 353);

                console.log('click next btn');
                await page.waitForTimeout(0.5 * 1000);
            } else {
                console.log('should be the end');
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

rankLookup('larva-doods');

export { rankLookup };
