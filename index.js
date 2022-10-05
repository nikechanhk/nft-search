/* eslint-disable max-len */
import 'dotenv/config';
import { listenToTg } from './src/constant';
import { wakeup } from './src/wakeup';
import express from 'express';
import _ from 'lodash';
import { OpenSeaStreamClient } from '@opensea/stream-js';
import cron from 'node-cron';
import { WebSocket } from 'ws';
import { onItemListed } from './src/opensea-event';
import constant from './src/constant';

const app = express();
const port = process.env.PORT || _.random(3000, 6000);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

cron.schedule('*/15 * * * *', async () => {
    await wakeup();
});

const client = new OpenSeaStreamClient({
    token: constant.openseaToken,
    connectOptions: {
        transport: WebSocket,
    },
});

listenToTg();

// onItemListed({
//     collectionSlug: constant.coolman.collectionSlug,
//     projId: constant.coolman.dbId,
//     osClient: client,
//     chatId: constant.coolman.tgChatId,
//     address: constant.coolman.address,
//     nftFilter: (params) => {
//         const { floorPrice, nftPrice, rank, traits } = params;

//         const clothesValue = _.toLower(_.get(traits, 'Clothes.value', ''));
//         const worldValue = _.toLower(_.get(traits, 'World.value', ''));
//         console.log('clothes, world:', clothesValue, worldValue);

//         return (
//             nftPrice <= floorPrice * 1.3 &&
//             (rank <= 1200 ||
//                 clothesValue === 'nude' ||
//                 worldValue === 'dino world' ||
//                 worldValue === 'wall street wasteland')
//         );
//     },
// });
// onItemListed({
//     collectionSlug: constant.sj.collectionSlug,
//     projId: constant.sj.dbId,
//     osClient: client,
//     chatId: constant.sj.tgChatId,
//     address: constant.sj.address,
//     nftFilter: (params) => {
//         const { floorPrice, nftPrice, rank, traits } = params;

//         const clothesValue = _.toLower(_.get(traits, 'Clothes.value', ''));
//         const propsValue = _.toLower(_.get(traits, 'Props.value', ''));
//         const swordsValue = _.toLower(
//             _.get(traits, ['Swords & Wings', 'value'], ''),
//         );
//         const hairValue = _.toLower(_.get(traits, 'Hair.value', ''));
//         console.log(
//             'clothes, Props, Swords, Hair:',
//             clothesValue,
//             propsValue,
//             swordsValue,
//             hairValue,
//         );

//         return (
//             nftPrice <= floorPrice * 1.35 &&
//             (rank <= 2000 ||
//                 hairValue === 'star' ||
//                 clothesValue === 'school girl uniform a' ||
//                 clothesValue === 'cape' ||
//                 clothesValue === 'space suit a' ||
//                 clothesValue === 'turtleneck sweater' ||
//                 propsValue === 'medical eye mask' ||
//                 propsValue === 'stunner shades' ||
//                 swordsValue === 'angel wings' ||
//                 swordsValue === 'double katana' ||
//                 swordsValue === 'devil wings' ||
//                 swordsValue === 'm-16')
//         );
//     },
// });
onItemListed({
    collectionSlug: constant.db.collectionSlug,
    projId: constant.db.dbId,
    osClient: client,
    chatId: constant.db.tgChatId,
    address: constant.db.address,
    nftFilter: (params) => {
        const { floorPrice, nftPrice, rank, traits } = params;

        const hairValue = _.toLower(_.get(traits, 'Hair.value', ''));
        const droneValue = _.toLower(_.get(traits, 'Drone.value', ''));
        const helmetValue = _.toLower(
            _.get(traits, ['Full Helmet', 'value'], ''),
        );
        const eyesValue = _.toLower(_.get(traits, 'Eyes.value', ''));
        console.log('hair, drone:', hairValue, droneValue);

        return (
            nftPrice <= 0.28 &&
            (rank <= 2000 ||
                hairValue === 'cyberbrain (blue)' ||
                hairValue === 'cyberbrain (gold)' ||
                (_.isString(droneValue) &&
                    droneValue.includes('armed drone')) ||
                hairValue === 'prince (super)' ||
                (_.isString(hairValue) && hairValue.includes('wukong')) ||
                (_.isString(hairValue) &&
                    hairValue.includes('spring beauty')) ||
                helmetValue === 'hard helmet (red)' ||
                eyesValue === 'laser (red)')
        );
    },
});
onItemListed({
    collectionSlug: constant.clementines_v1.collectionSlug,
    projId: constant.clementines_v1.dbId,
    osClient: client,
    chatId: constant.clementines_v1.tgChatId,
    address: constant.clementines_v1.address,
    nftFilter: (params) => {
        const { floorPrice, nftPrice, rank, traits } = params;

        const characterValue = _.toLower(_.get(traits, 'Character.value', ''));
        console.log('character:', characterValue);

        return (
            nftPrice <= floorPrice * 1.02 &&
            (rank <= 500 ||
                characterValue === 'vespyre' ||
                characterValue === 'clementine')
        );
    },
});
onItemListed({
    collectionSlug: constant.clementines_v2.collectionSlug,
    projId: constant.clementines_v2.dbId,
    osClient: client,
    chatId: constant.clementines_v2.tgChatId,
    address: constant.clementines_v2.address,
    nftFilter: (params) => {
        const { floorPrice, nftPrice, rank, traits } = params;
        return nftPrice <= 0.035 && rank <= 1000;
    },
});
onItemListed({
    collectionSlug: constant.timeless.collectionSlug,
    projId: undefined,
    osClient: client,
    chatId: constant.timeless.tgChatId,
    address: constant.timeless.address,
    nftFilter: (params) => {
        const { floorPrice, nftPrice, rank, traits } = params;

        const clothingValue = _.toLower(_.get(traits, 'Clothing.value', ''));
        const backValue = _.toLower(_.get(traits, 'Back.value', ''));
        const faceValue = _.toLower(_.get(traits, 'Face.value', ''));
        const haloValue = _.toLower(_.get(traits, 'Halo.value', ''));
        const hatValue = _.toLower(_.get(traits, 'Hat.value', ''));
        const hornsValue = _.toLower(_.get(traits, 'Horns.value', ''));
        console.log(
            'clothing, back, face, halo, hat, horns:',
            clothingValue,
            backValue,
            faceValue,
            haloValue,
            hatValue,
            hornsValue,
        );

        return (
            nftPrice <= floorPrice * 0.9 ||
            (nftPrice <= floorPrice * 1.4 &&
                (clothingValue === 'suit' ||
                    clothingValue === 'spacesuit' ||
                    clothingValue === 'golden armour' ||
                    backValue === 'soul sword' ||
                    backValue === 'headband' ||
                    faceValue === 'soul mask' ||
                    haloValue === 'true' ||
                    hatValue === 'crown' ||
                    hatValue === 'oni mask' ||
                    hatValue === 'iron mask' ||
                    hornsValue === 'golden horns'))
        );
    },
});
onItemListed({
    collectionSlug: constant.renga.collectionSlug,
    projId: undefined,
    osClient: client,
    chatId: constant.renga.tgChatId,
    address: constant.renga.address,
    nftFilter: (params) => {
        const { floorPrice, nftPrice, traits } = params;

        const archetypeValue = _.toLower(_.get(traits, 'Archetype.value', ''));
        const clothingValue = _.toLower(_.get(traits, 'Clothing.value', ''));
        const headwearValue = _.toLower(_.get(traits, 'Headwear.value', ''));
        const maskValue = _.toLower(_.get(traits, 'Mask.value', ''));
        const bodyValue = _.toLower(_.get(traits, 'Body.value', ''));
        const faceValue = _.toLower(_.get(traits, 'Face.value', ''));
        const beardValue = _.toLower(_.get(traits, 'Beard.value', ''));
        const headValue = _.toLower(_.get(traits, 'Head.value', ''));
        console.log('archetypeValue: ', archetypeValue);

        return (
            nftPrice <= floorPrice * 0.9 ||
            (nftPrice <= 2.5 &&
                (headValue === 'shadow' ||
                    headValue.includes('vandal') ||
                    clothingValue === 'invsbl jkt' ||
                    headwearValue.includes('69 lives') ||
                    headwearValue === 'golden era' ||
                    headwearValue.includes('cube helmet') ||
                    headwearValue === 'varsity' ||
                    headwearValue === 'arcade' ||
                    headwearValue === 'just dead' ||
                    headwearValue.includes('speed demon') ||
                    headwearValue.includes('agent rally') ||
                    headwearValue === 'dead red' ||
                    headwearValue.includes('motor corp:') ||
                    headwearValue === 'catsune' ||
                    headwearValue === 'skull rider' ||
                    headwearValue === 'tako party' ||
                    headwearValue === 'wings gold' ||
                    headwearValue === 'spark rider' ||
                    faceValue.includes('jawbreaker') ||
                    beardValue.length > 0 ||
                    bodyValue === 'vandal' ||
                    maskValue.length > 0))
        );
    },
});
