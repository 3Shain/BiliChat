import { Observable } from 'rxjs';
import {
    Message, StickerMessage, TextMessage
} from '@comen/common';
import { connectAcfunLiveWs } from 'isomorphic-danmaku/acfun';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as Long from 'long';
import { waitTimeout } from '../../common/utils';

@Injectable()
export class AcfunSource {

    // avatar address cache?
    readonly type = 'acfun';

    constructor(private http: HttpClient) { }

    connect({ roomId }) {
        return this.http.get<AcfunRoominfoResponse>(`/api/acfun/getRoomInfo?roomid=${roomId}`)
            .pipe(
                switchMap((data) => {
                    if (data.closed) {
                        // TODO:
                        throw new Error('live is closed');
                    } else {
                        return this._connect(data as Required<AcfunRoominfoResponse>);
                    }
                })
            );
    }

    private _connect(resp: AcfunRoominfoResponse) {
        return new Observable((observer) => {
            // 简易coroutine模型
            const abort = new AbortController();
            (async () => {
                let errorCounter = 0;
                if (errorCounter > 3) {
                    observer.error(new Error('Failed to connect to server.'));
                    observer.complete();
                    return;
                }
                while (!observer.closed) {
                    try {
                        for await (const msg of connectAcfunLiveWs({
                            liveId: resp.liveId,
                            serviceToken: resp.serviceToken,
                            acSecurity: resp.acSecurity,
                            enterRoomAttach: resp.enterRoomAttach,
                            tickets: resp.tickets,
                            userId: resp.userId,
                            abort
                        } as any) as AsyncGenerator<AcfunMsg, unknown, unknown>) {
                            switch (msg.type) {
                                case 'CommonActionSignalComment':
                                    observer.next({
                                        type: 'text',
                                        content: msg.data.content,
                                        avatar: msg.data.userInfo.avatar[0].url,
                                        badges: [],
                                        username: msg.data.userInfo.nickname,
                                        usertype: (msg.data.userInfo.userIdentity.managerType == 1 ? 0x2 : 0),
                                        platformUserId: msg.data.userInfo.userId.toNumber()
                                    } as TextMessage);
                                    break;
                                case 'CommonActionSignalGift':
                                    {
                                        const giftInfo = resp.giftInfo.giftList.find
                                            (x => x.giftId == msg.data.giftId.toNumber());
                                        if (!giftInfo) {
                                            break; // in case not found
                                        }
                                        observer.next({
                                            type: 'sticker',
                                            avatar: msg.data.user.avatar[0].url,
                                            sticker: giftInfo.webpPicList[0].url,
                                            username: msg.data.user.nickname,
                                            amount: msg.data.count,
                                            itemInfo: `投喂 ${giftInfo.giftName} ×${msg.data.count}`,
                                            price: giftInfo.payWalletType == 1 ? giftInfo.giftPrice : 0,
                                            platformPrice: giftInfo.payWalletType == 2 ? giftInfo.giftPrice : 0,
                                            platformUserId: msg.data.user.userId.toNumber(),
                                        } as StickerMessage)
                                        break;
                                    }
                            }
                        }
                    }
                    catch (e) {
                        await waitTimeout(5000);
                    }
                    errorCounter++;
                }
            })();
            return () => {
                abort.abort();
            };
        }).pipe() as Observable<Message>;
    }
}

type AcfunMsg = {
    type: 'CommonActionSignalGift',
    data: {
        giftId: Long,
        user: {
            avatar: {
                url: string;
            }[],
            nickname: string;
            userId: Long,
            userIdentity: {
                managerType: number
            }
        },
        value: Long,
        count: number,
        combo: number,
        comboId: string
    }
} | {
    type: 'CommonActionSignalComment',
    data: {
        content: string;
        userInfo: {
            userId: Long,
            nickname: string,
            badge: string, // medalInfo: {uperId userId clubName level}
            userIdentity: {
                managerType: number
            }
            , avatar: {
                url: string;
            }[],
        }
    }
}

type AcfunRoominfoResponse = {
    closed: boolean;
    acSecurity: string;
    userId: number;
    serviceToken: string;
    tickets?: string[];
    enterRoomAttach?: string;
    liveId?: string;
    giftInfo?: {
        giftList: {
            allowBatchSendSizeList: number[];
            arLiveName: string;
            canCombo: boolean;
            canDraw: boolean;
            description: string;
            giftId: number;
            giftName: string;
            giftPrice: number;
            magicFaceId: number;
            payWalletType: number;
            pngPicListt: {
                cdn: string;
                freeTraffic: boolean;
                url: string;
                urlPattern: string;
            }[];
            smallPngPicList: {
                cdn: string;
                freeTraffic: boolean;
                url: string;
                urlPattern: string;
            }[];
            webpPicList: {
                cdn: string;
                freeTraffic: boolean;
                url: string;
                urlPattern: string;
            }[];
            redpackPrice: number;
        }[];
        externalDisplayGiftId: number;
        giftListHash: string;
        externalDisplayGiftTipsDelayTime: number;
    }
}