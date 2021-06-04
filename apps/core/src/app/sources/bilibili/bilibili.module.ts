import { NgModule } from "@angular/core";
import { BilibiliSource } from "./bilibili";

@NgModule({
    providers: [
        BilibiliSource
    ]
})
export class BilibiliSourceModule {
    source = BilibiliSource;
}