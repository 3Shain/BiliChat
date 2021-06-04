export interface ComenConfiguration {

    platform?: string;
    roomId?: string;

    bilichat?: unknown;

    disableAnalytics: boolean,

    /**
     * 
     */
    userBlacklist: number[],
    wordBlacklist: string[],
    minGiftValue: number,
    levelFilter: number, //? what level?
    /**
     * bits (7h -> 0l): 0 0 0 0 <member> <paid message> <sticker> <message>
     */
    typeFilterControlBit: number;

    groupSimilar: boolean,
    groupSimilarWindow: number,

    /**
     * Misc
     */
    disableSmoother: boolean,
    hideTimestamp: boolean,

    /**
     * Renderer settings
     */

    maxDanmakuNumber: number;

    /**
     * Bilibili
     * 
     */
    silverGoldRatio: number,
    showGiftAutoDammaku: boolean,
    disableAvatarPreload: boolean,
    useJapaneseSC: boolean,

    /**
     * Acfun
     */
}

export const DEFAULT_CONFIG: ComenConfiguration = {

    disableAnalytics: false,

    userBlacklist: [],
    wordBlacklist: [],
    levelFilter: 0,
    minGiftValue: 5,
    typeFilterControlBit: 0,

    groupSimilar: false,
    groupSimilarWindow: 5,

    disableSmoother: false,
    hideTimestamp: false,

    maxDanmakuNumber: 100,
    //bili
    silverGoldRatio: 0,
    showGiftAutoDammaku: false,
    disableAvatarPreload: false,
    useJapaneseSC: false
}


