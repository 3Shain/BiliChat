import { Controller, Get, ParseIntPipe, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { getAcfunRoomInfo } from 'isomorphic-danmaku-server';

@Controller('api/acfun')
export class AcfunController {

    @Get('getRoomInfo')
    async getRoomInfo(@Query('roomid', ParseIntPipe) roomid: number,
        @Res() res: Response) {
        return res.json(await getAcfunRoomInfo(roomid));
    }
}