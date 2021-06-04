import { NgModule } from "@angular/core";
import { AcfunSource } from "./acfun";

@NgModule({
    providers: [
        AcfunSource
    ]
})
export class AcfunSourceModule {
    source = AcfunSource;
}