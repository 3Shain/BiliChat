import { Observable, of, OperatorFunction } from 'rxjs';
import {
    Message, TextMessage, StickerMessage, PaidMessage, MemberMessage,
    LiveStartMessage, LiveStopMessage, SystemMessage,
    SafeAny
} from '@comen/common';
import { connectBilibiliLiveWs } from 'isomorphic-danmaku/bilibili';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { abortable } from '../../common/rx';
import { waitTimeout } from '../../common/utils';

@Injectable()
export class BilibiliSource {

    readonly type = 'bilibili';

    private __lastLIVECMD = 0;
    private __lastPREPCMD = 0;

    constructor(private http: HttpClient) { }

    connect(config: {
        roomId: number,
        silverGoldRatio: number,
        showGiftAutoDammaku: boolean,
        disableAvatarPreload: boolean,
        useJapaneseSC: boolean
    }) {
        return new Observable((observer) => {
            const abortController = new AbortController();
            (async () => {
                await waitTimeout(0);
                while (!observer.closed) {
                    try {
                        observer.next({
                            type: 'system',
                            data: {
                                status: 'FETCHING'
                            }
                        } as SystemMessage);
                        const resp = await this.http.get<BilibiliRoominfoResponse>(`/api/bili/getRoomInfo?roomid=${config.roomId}`)
                            .pipe(abortable(abortController),
                            catchError(e=>{
                                return of({
                                    roomInfo:{
                                        room_id: config.roomId,
                                        uid: -1,
                                        live_status: -1,

                                    },
                                    danmuInfo: {
                                        token: ""
                                    },
                                    giftInfo:{
                                        list: []
                                    }
                                })
                            })).toPromise();
                        observer.next({
                            type: 'system',
                            data: {
                                status: 'CONNECTING'
                            }
                        } as SystemMessage);
                        for await (const msg of connectBilibiliLiveWs({
                            roomId: resp.roomInfo.room_id,
                            abort: abortController,
                            token: resp.danmuInfo.token
                        }) as AsyncGenerator<BilibiliMsg, unknown, unknown>) {
                            if (msg.cmd == 'DANMU_MSG' || msg.cmd.startsWith('DANMU_MSG')) {
                                assumeType<{ cmd: 'DANMU_MSG'; info: SafeAny[]; }>(msg);
                                if (!config.showGiftAutoDammaku && msg.info[0][9] > 0) {
                                    continue;
                                }
                                observer.next({
                                    type: 'text',
                                    content: msg.info[1],
                                    avatar: '',
                                    badges: [
                                        ...[guardType[msg.info[7]]
                                        ].filter(Boolean) // TODO: custom badge
                                    ],
                                    username: msg.info[2][1],
                                    usertype: (
                                        (msg.info[7] > 0 ? 0x1 : 0x0) // member
                                        | (msg.info[2][2] == 1 ? 0x2 : 0x0) // moderator
                                        | (msg.info[2][0] == resp.roomInfo.uid ? 0x04 : 0x0) //owner
                                    ),
                                    platformUserId: msg.info[2][0],
                                    platformUserExtra: {
                                        guardType: msg.info[7]
                                    },
                                    platformUserLevel: msg.info[4][0]
                                } as TextMessage);
                                continue;
                            }
                            switch (msg.cmd) {
                                case '__CONNECTED__':
                                    observer.next({
                                        type: 'system',
                                        data: {
                                            status: 'CONNECTED'
                                        }
                                    } as SystemMessage);
                                    if (resp.roomInfo.live_status == 1) { // TODO:
                                        observer.next({
                                            type: 'livestart'
                                        } as LiveStartMessage);
                                    }
                                    break;
                                case '__ERROR__':
                                    // TODO: report
                                    break;
                                case 'SEND_GIFT':
                                    // console.log(msg);
                                    if (config.silverGoldRatio > 0) {
                                        // mutate object, not a good practice but ok
                                        msg.data.coin_type = 'gold';
                                        msg.data.total_coin *= config.silverGoldRatio;
                                    }
                                    observer.next({
                                        type: 'sticker',
                                        sticker: resp.giftInfo.list.find(x => x.id == msg.data.giftId)?.webp,
                                        avatar: '',
                                        username: msg.data.uname,
                                        amount: msg.data.num,
                                        itemInfo: `${msg.data.action} ${msg.data.giftName} ×${msg.data.num}`,
                                        price: msg.data.coin_type == 'gold' ? msg.data.total_coin / 1000 : 0,
                                        platformPrice: msg.data.coin_type == 'silver' ? msg.data.total_coin : 0,
                                        platformUserId: msg.data.uid
                                    } as StickerMessage);
                                    break;
                                case 'GUARD_BUY':
                                    // console.log(msg);
                                    observer.next({
                                        type: 'member',
                                        avatar: '',
                                        username: msg.data.username,
                                        price: msg.data.price / 1000,
                                        platformUserId: msg.data.uid,
                                        platformMemberType: msg.data.guard_level,
                                        platformPrice: msg.data.price,
                                        itemInfo: '欢迎加入大航海'
                                    } as MemberMessage);
                                    break;
                                case 'COMBO_SEND':
                                    // console.log(msg);
                                    break;
                                case 'SUPER_CHAT_MESSAGE_JPN':
                                    observer.next({
                                        type: 'paid',
                                        avatar: msg.data.user_info.face,
                                        username: msg.data.user_info.uname,
                                        content: config.useJapaneseSC ? msg.data.message_jpn : msg.data.message,
                                        itemInfo: `CN¥${msg.data.price}`,
                                        price: msg.data.price,
                                        platformUserId: msg.data.uid,
                                    } as PaidMessage);
                                    break
                                case 'LIVE':
                                    if (Date.now() - this.__lastLIVECMD < 30000) {
                                        break; // weired behavior
                                    }
                                    this.__lastLIVECMD = Date.now();
                                    observer.next({
                                        type: 'livestart'
                                    } as LiveStartMessage);
                                    break;
                                case 'PREPARING':
                                    if (Date.now() - this.__lastPREPCMD < 30000) {
                                        break; // weired behavior
                                    }
                                    this.__lastPREPCMD = Date.now();
                                    observer.next({
                                        type: 'livestop'
                                    } as LiveStopMessage)
                                    break;
                            }
                        }
                        // break; // peacefully terminated
                    } catch (e) {
                        if (e == 'ABORTED') {
                            break; // peacefully terminated
                        }
                        //error occured! try to reconnect!
                        observer.next({
                            type: 'system',
                            data: {
                                status: 'ERROR'
                            }
                        } as SystemMessage);
                        await waitTimeout(5 * 1000);
                    }
                }
            })();
            return () => {
                abortController.abort();
            };
        }).pipe(this._avatarPreloadPipe(Boolean(config.disableAvatarPreload))) as Observable<Message>;
    }

    private _avatarPreloadPipe(disabled: boolean): OperatorFunction<Message, Message> {
        return (upstream) => {
            if (disabled) {
                return upstream;
            }
            return new Observable((obs) => {
                return upstream.subscribe({
                    next: (x) => {
                        if (x.type == 'text' || x.type == 'sticker'
                            || x.type == 'member') {
                            this.http.get<{
                                url: string
                            }>(`/api/bili/getAvatar?uid=${x.platformUserId}`).pipe(timeout(10 * 1000)).subscribe((ret) => {
                                if (ret.url !== 'http://static.hdslb.com/images/member/noface.gif') {
                                    ret.url = ret.url + '@48w_48h'
                                }
                                x.avatar = ret.url;
                                obs.next(x);
                            }, () => {
                                // failed to load
                                x.avatar = 'http://static.hdslb.com/images/member/noface.gif';
                                obs.next(x);
                            });
                        } else {
                            obs.next(x);
                        }
                    },
                    error: e => obs.error(e),
                    complete: () => obs.complete()
                });
            });
        }
    }
}

const guardType = {
    1: {
        type: 'member',
        badge: 'https://i0.hdslb.com/bfs/activity-plat/static/20200716/1d0c5a1b042efb59f46d4ba1286c6727/icon-guard1.png@44w_44h.webp'
    },
    2: {
        type: 'member',
        badge: 'https://i0.hdslb.com/bfs/activity-plat/static/20200716/1d0c5a1b042efb59f46d4ba1286c6727/icon-guard2.png@44w_44h.webp'
    },
    3: {
        type: 'member',
        badge: 'https://i0.hdslb.com/bfs/activity-plat/static/20200716/1d0c5a1b042efb59f46d4ba1286c6727/icon-guard3.png@44w_44h.webp'
    }
}

type BilibiliMsg = {
    cmd: 'DANMU_MSG';
    info: SafeAny[];
} | {
    cmd: 'SEND_GIFT';
    data: {
        coin_type: 'gold' | 'silver',
        uid: number,
        uname: string,
        giftName: string;
        num: number;
        total_coin: number;
        giftId: number;
        action: string;
    }
} | {
    cmd: 'GUARD_BUY';
    data: {
        uid: number;
        username: string;
        gift_name: string;
        num: number;
        price: number;
        guard_level: number;
    }
} | {
    cmd: 'SUPER_CHAT_MESSAGE_JPN';
    data: {
        uid: number;
        user_info: {
            uname: string;
            face: string;
        };
        price: number;
        message_jpn: string;
        message: string;
    }
} | {
    cmd: 'WELCOME_GUARD';
    data: {
        uid: number;
        username: string;
        guard_level: number;
    }
} | {
    cmd: 'INTERACT_WORD';
    data: {
        contribution: {
            grade: number;
        },
        identities: [number];
        is_spread: number;
        msg_type: number;
        roomid: number;
        uid: string;
        uname: string;
        uname_color: string;
    }
} | {
    cmd: 'COMBO_SEND',
    data: {
        gift_id: number;
        gift_name: string;
        gift_nun: string;
        is_show: number;
        uid: number;
        uname: string;
        action: string;
        batch_combo_id: string;
        batch_combo_num: number;
        combi_id: string;
        combo: number;
        combo_total_coin: number;
    }
} | {
    cmd: 'ROOM_REAL_TIME_MESSAGE_UPDATA';
    data: {
        fans: number;
        fans_club: number;
        roomid: number;
        red_notice: number;
    }
} | {
    cmd: 'PREPARING';
    roomid: number;
} | {
    cmd: 'LIVE';
} | {
    cmd: '__CONNECTED__'
} | {
    cmd: '__ERROR__';
    //eslint-disable-next-line
    error: any;
}

type BilibiliRoominfoResponse = {
    roomInfo: {
        room_id: number;
        short_id: number;
        uid: number;
        need_p2p: number;
        is_hidden: boolean;
        is_locked: boolean;
        is_portrait: boolean;
        live_status: number;
        hidden_till: number;
        lock_till: number;
        encrypted: boolean;
        pwd_verified: boolean;
        live_time: number;
        room_shield: number;
        special_type: number;
    },
    danmuInfo: {
        token: string;
        host_list: {
            host: string;
            port: number;
            wss_port: number;
            ws_port: number;
        }[]
    },
    giftInfo: {
        list: {
            id: number;
            number: string;
            price: number;
            coin_type: 'silver' | 'gold';
            img_basic: string;
            img_dynamic: string; gift: string;
            webp: string;
        }[]
    }
}

function assumeType<T>(x: unknown): asserts x is T {
    return; // ¯\_(ツ)_/¯
}
