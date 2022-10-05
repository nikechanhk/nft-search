import tg from 'node-telegram-bot-api';
import _ from 'lodash';

export const TG_KEY = process.env.TG_KEY != null ? process.env.TG_KEY : '';

export const listenToTg = () => {
    const bot = new tg(TG_KEY, { polling: true });
    bot.on('text', async (msg) => {
        const incomingChatId = msg.chat.id;

        let address = '';
        if (incomingChatId === -724850223) {
            // duskbreakers
            address = '0x0beed7099af7514ccedf642cfea435731176fb02';
        } else if (incomingChatId === -605694230) {
            // the heart proj
            address = '0xce50f3ca1f1dbd6fa042666bc0e369565dda457d';
        } else if (incomingChatId === -703767774) {
            // mtg
            address = '0x49907029e80de1cbb3a46fd44247bf8ba8b5f12f';
        } else if (incomingChatId === -609852262) {
            // netvrk
            address = '0x244fc4178fa685af909c88b4d4cd7eb9127edb0b';
        } else if (incomingChatId === -642665248) {
            // bad face
            address = '0x65cc7530e8c6f5a51257f7b7586361c4a22cec93';
        } else if (incomingChatId === -703271870) {
            // nightmare v2
            address = '0x17aad3fcf1703ef7908777084ec24e55bc58ae33';
        } else if (incomingChatId === -502993593) {
            // sj
            address = '0xf4121a2880c225f90dc3b3466226908c9cb2b085';
        } else if (incomingChatId === -725579326) {
            // nightmare v1
            address = '0x5c3cc8d8f5c2186d07d0bd9e5b463dca507b1708';
        } else if (incomingChatId === -791279745) {
            // timeless
            address = '0x704bf12276f5c4bc9349d0e119027ead839b081b';
        } else if (incomingChatId === -751856062) {
            // renga
            address = '0x394e3d3044fc89fcdd966d3cb35ac0b32b0cda91';
        } else {
            // coolman
            address = '0xa5c0bd78d1667c13bfb403e2a3336871396713c5';
        }

        console.log('incoming chat id', incomingChatId);
        console.log('msg', msg.text);

        if (msg.text == null) {
            return;
        }

        const msgArray = msg.text.split(' ');
        const cmd = msgArray[0];
        const cmdContent = msgArray[1];
        if (_.lowerCase(cmd) === 'os') {
            if (msgArray != null && msgArray.length > 1) {
                if (_.isNumber(_.toNumber(cmdContent))) {
                    console.log('cmd content', cmdContent);
                    if (address != null) {
                        bot.sendMessage(
                            incomingChatId,
                            `https://opensea.io/assets/${address}/${cmdContent}`,
                        );
                    }
                }
            }
        } else if (_.lowerCase(cmd) === 'meta') {
            if (msgArray != null && msgArray.length > 1) {
                if (_.isNumber(_.toNumber(cmdContent))) {
                    console.log('cmd content', cmdContent);
                    const link = `https://metamask.app.link/dapp/opensea.io/assets/${address}/${cmdContent}`;
                    if (address != null) {
                        bot.sendMessage(incomingChatId, link);
                    }
                }
            }
        }
    });
};
