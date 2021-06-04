import { Injectable, OnDestroy } from '@angular/core';
import { ComenEnvironmentHost } from '@comen/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BLUE, ColorInfo, CYAN, MAGNET, ORANGE, RED, YELLOW, YELLOW_GREEN } from './consts';

export interface GammaConfiguration {
    hideTimestamp: boolean;
    tickerDisplayThreshold: number;
    disableSmoother: boolean;
    maxDanmakuNumber: number;
}

export const DEFAULT_GAMMA_CONFIGURATION: GammaConfiguration = {
    hideTimestamp: false,
    tickerDisplayThreshold: 50,
    disableSmoother: false,
    maxDanmakuNumber: 100
}

/**
 * Legacy configuration
 */
@Injectable()
export class GammaConfigService implements OnDestroy {


    destroy$ = new Subject<void>();
    //mutable :ascending order
    private colorInfoList = [CYAN, YELLOW_GREEN, YELLOW, ORANGE, MAGNET, RED].sort((a, b) => a.price_limit - b.price_limit);

    // TODO: remove
    current$: BehaviorSubject<GammaConfiguration> = new BehaviorSubject(DEFAULT_GAMMA_CONFIGURATION);

    constructor(host: ComenEnvironmentHost) {
        host.config('__legacy__').pipe(takeUntil(this.destroy$)).subscribe(config => {
            // TODO: validate
            this.current$.next({
                ...DEFAULT_GAMMA_CONFIGURATION,
                ...config,
            });
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    getColorInfo(value: number) {
        let lastColorInfo: ColorInfo = BLUE;
        for (const info of this.colorInfoList) {
            if (value >= info.price_limit) {
                lastColorInfo = info;
            } else {
                break;
            }
        }
        return lastColorInfo;
    }

    setColorInfos(colorInfos: ColorInfo[]) {
        this.colorInfoList = colorInfos.sort((a, b) => a.price_limit - b.price_limit);
    }
}