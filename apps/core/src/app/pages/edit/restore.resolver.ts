import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { SafeAny } from "@comen/common";
import { FileStorage } from "../../file";

@Injectable()
export class RestoreSessionResovler implements Resolve<SafeAny>{

    constructor(private file: FileStorage) { }

    async resolve(snap:ActivatedRouteSnapshot) {
        const modifyingSession = sessionStorage.getItem('modifying');
        if (modifyingSession != undefined) {
            const c = await this.file.getFile(modifyingSession);
            return {
                file: c,
                data: await c.getData()
            };
        } else if(snap.queryParams.id){
            const c = await this.file.getFile(snap.queryParams.id);
            return {
                file: c,
                data: await c.getData()
            };
        }
        return undefined;
    }
}