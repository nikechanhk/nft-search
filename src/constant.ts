export default {
    coolman: {
        collectionSlug: 'coolmans-universe',
        dbId: 'coolmans-universe',
        tgChatId: '-647073823',
        address: '0xa5c0bd78d1667c13bfb403e2a3336871396713c5',
    },
    sj: {
        collectionSlug: 'shonen-junk-official',
        dbId: 'shonen-junk-official',
        tgChatId: '-502993593',
        address: '0xf4121a2880c225f90dc3b3466226908c9cb2b085',
    },
    db: {
        collectionSlug: 'duskbreakers',
        dbId: 'duskbreakers',
        tgChatId: '-724850223',
        address: '0x0beed7099af7514ccedf642cfea435731176fb02',
    },
    clementines_v1: {
        collectionSlug: 'official-clementines-nightmare',
        dbId: 'assets_clementine-s-nightmare',
        tgChatId: '-725579326',
        address: '0x5c3cc8d8f5c2186d07d0bd9e5b463dca507b1708',
    },
    clementines_v2: {
        collectionSlug: 'clementines-nightmare-eclipse',
        dbId: 'assets_clementine-s-nightmare-v2',
        tgChatId: '-703271870',
        address: '0x17aad3fcf1703ef7908777084ec24e55bc58ae33',
    },
    timeless: {
        collectionSlug: 'timelessnfts',
        tgChatId: '-791279745',
        address: '0x704bf12276f5c4bc9349d0e119027ead839b081b',
    },
    renga: {
        collectionSlug: 'renga',
        tgChatId: '-875915835',
        address: '0x394e3d3044fc89fcdd966d3cb35ac0b32b0cda91',
    },
    openseaToken: process.env.OS_API_KEY != null ? process.env.OS_API_KEY : '',
} as const;
