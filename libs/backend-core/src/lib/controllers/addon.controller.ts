import { Controller, Get, ParseIntPipe, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { take } from "rxjs/operators";
import { AddonService } from "../services/addon.service";

@Controller('api/addon')
export class AddonController {

    constructor(private addon: AddonService) { }

    @Get('install')
    installAddon() {
        // transactional
        // from npm or other repository
    }

    @Get('uninstall')
    uninstallAddon() {
        // transactional
        // 幂等操作
    }

    @Get('list')
    async listAddon() {
        return await this.addon.pluginInfo$.pipe(take(1)).toPromise();
    }

    @Get('asset')
    asset() {

    }

    @Get('icon')
    async icon(@Query('name') name: string) {
        const list = await this.addon.pluginInfo$.pipe(take(1)).toPromise();

    }
}