import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { GammaApp } from './gamma.app';
import { TextMessageRenderer } from './text-message/text-message';
import { PaidMessageRenderer } from './paid-message/paid-message';
import { TickerPaidStickerItemRenderer } from './ticker-paid-sticker/ticker-paid-sticker';
import { MembershipItemRenderer } from './membership-item/membership-item';
import { PaidStickerRenderer } from './paid-sticker/paid-sticker';
import { TickerSponsorItemRenderer } from './ticker-sponsor-item/ticker-sponsor-item';
import { TickerPaidMessageItemRenderer } from './ticker-paid-item/ticker-paid-item';
import { ReactiveComponentModule } from '@ngrx/component';
import { COMMENT_CONFIGURATION } from './metadata';

@NgModule({
    declarations: [
        GammaApp,
        TextMessageRenderer,
        PaidMessageRenderer,
        MembershipItemRenderer,
        PaidStickerRenderer,
        TickerSponsorItemRenderer,
        TickerPaidMessageItemRenderer,
        TickerPaidStickerItemRenderer,
    ],
    imports: [CommonModule, ReactiveComponentModule],
    providers: [],
    exports: [GammaApp],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GammaModule {
    entry = GammaApp;
    metadata = {
        name: 'gamma',
        displayName: 'GAMMA',
        editable: false,
        configuration: COMMENT_CONFIGURATION,
    };
}
