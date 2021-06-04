import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { OverlayInfo, SourceInfo } from "./definations";
import { LookupService } from "./lookup.service";

@Injectable()
export class AddonLazyloadResolver implements Resolve<{
    overlay?: OverlayInfo,
    source?: SourceInfo
}> {

    constructor(
        private lookup: LookupService
    ) { }

    async resolve(snapshot: ActivatedRouteSnapshot) {
        return {
            overlay: snapshot.queryParams.o?await this.lookup.ensureOverlayLoaded(snapshot.queryParams.o):undefined,
            source: snapshot.queryParams.p?await this.lookup.ensureSourceLoaded(snapshot.queryParams.p):undefined
        };
    }
}