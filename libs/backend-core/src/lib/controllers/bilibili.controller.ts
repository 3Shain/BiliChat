import { Controller, Get, Query, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { BilibiliUserService } from '../services/bili-user.service';
import { getBilibiliRoomInfo } from 'isomorphic-danmaku-server';

@Controller('api/bili')
export class BilibiliController {
    constructor(private bilibiliUser: BilibiliUserService) {

    }

    @Get('getRoomInfo')
    async getRoomInfo(@Query('roomid', ParseIntPipe) roomid: number) {
        return await getBilibiliRoomInfo(roomid, {
            fetchGift: true,
            fetchHistoryDanmaku: false
        });
    }

    @Get('getAvatar')
    async getAvatar(@Query('uid', ParseIntPipe) uid: number, @Res() resp: Response) {
        // cache
        const cached = await this.bilibiliUser.getUserInfoFromCache(uid);
        if (!cached.temp) {
            resp.setHeader("Cache-Control", `public,max-age=${3 * 24 * 60 * 60}`);
        }
        return resp.json({
            url: cached.face
        });
    }
}