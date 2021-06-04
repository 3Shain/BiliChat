import { SafeAny } from '@comen/common';
import { ComenConfiguration } from './config';

export function mergeQueryParameters(query: SafeAny, config: ComenConfiguration) {
    if (query.bilichat != undefined) {
        /**
         * these query parameters is for bilichat compatibility, do not use if you don't know about it
         */
        config.bilichat = true;
        // in bilichat, groupSimilar is default on
        config.groupSimilar = query.groupSimilar ?? true;
        config.groupSimilarWindow = ('groupSimilarWindow' in query) ? parseInt(query.groupSimilarWindow) : 5;
        config.hideTimestamp = true; // BILICHAT doesn't provide timestamp

        // TODO: implement all bilichat compatiable options
        if (query.loadAvatar == 'false') {
            config.disableAvatarPreload = true;
        }
        if (query.levelFilter != undefined) {
            config.levelFilter = parseInt(query.levelFilter);
        }
        if (query.hideGiftDanmaku == 'false') {
            config.showGiftAutoDammaku = true;
        }
        if (query.wordFilter != undefined) {
            const words = (query.wordFilter as string).split(',');
            config.wordBlacklist?.push(...words);
        }
        if(query.giftOnly=='true'){
            config.typeFilterControlBit = 0b1001; // is that correct?
        }
        if (query.showGift == 'false') {
            config.typeFilterControlBit = config.typeFilterControlBit ^ 0b0010;
        }
        if (query.showJapanese == 'true') {
            config.useJapaneseSC = true;
        }
        if (query.blackList != undefined) {
            const blacklist = (query.blackList as string).split(',').map((v) => parseInt(v));
            config.userBlacklist?.push(...blacklist);
        }
        if (query.pure == 'true') {
            config.disableAvatarPreload = true;
            // No other effect
        }
        if(query.minGiftValue!=undefined){
            config.minGiftValue = parseFloat(query.minGiftValue);
        }
        if (query.silverGoldRatio != undefined) {
            config.silverGoldRatio = parseInt(query.silverGoldRatio);
        }
    } else {

    }
    if (query.disableAnalytics == 'true') {
        config.disableAnalytics = true;
    }
    config.platform = query.p;
    config.roomId = query.id;
    return config;
}
