import { Injectable } from "@nestjs/common";
import * as os from 'os';
import { resolve } from "path";
import { Subject } from "rxjs";
import { exhaustMap, shareReplay, startWith } from 'rxjs/operators';
import * as tar from 'tar';
import * as lock from 'proper-lockfile';
import * as fse from 'fs-extra';

export interface ComenAddonInfo {
    name: string;
    displayName: string;
    icon: string;
    version: string;
    overlays: {
        name: string;
        displayName: string;
        icon: string;
        load: string;
    }[],
    sources: {
        name: string;
        displayName: string;
        icon: string;
        load: string;
    }[]
}

@Injectable()
export class AddonService {

    workDir = resolve(os.homedir(), '.comen');
    addonsDir = resolve(this.workDir, 'addons');

    constructor() {

    }

    updatePluginInfo$ = new Subject<void>();
    pluginInfo$ = this.updatePluginInfo$.pipe(
        startWith<void, void>(void 0),
        exhaustMap(async () => {
            if (!fse.existsSync(this.workDir)) {
                await fse.mkdir(this.workDir);
                await fse.mkdir(this.addonsDir);
            }
            // block : 
            return fse.readdirSync(this.addonsDir).map(
                d => {
                    return {
                        path: resolve(this.addonsDir,d),
                        state: fse.lstatSync(resolve(this.addonsDir,d))
                    }
                }
            ).filter(
                f => f.state.isDirectory() && fse.existsSync(resolve(f.path, "package.json"))
            ).map(addonDir => {
                return JSON.parse(fse.readFileSync(resolve(addonDir.path, "package.json"), "utf-8")) as ComenAddonPackageJson;
            }).filter(pkg => pkg.comen != undefined)
                .map(pkg => {
                    return {
                        name: pkg.name,
                        displayName: pkg.comen.displayName,
                        overlays: pkg.comen.overlays,
                        sources: pkg.comen.sources,
                        version: pkg.version,
                        icon: pkg.icon
                    } as ComenAddonInfo;
                });
        }),
        shareReplay(1)
    );

    isInAddonWhitelist(ipOrDomain: string) {

    }

    async installAddon(tarFile: string) {
        //lock
        //download

        //extract
        await tar.extract({
            file: tarFile,
            cwd: '',
            strip: 1
        });
        // load
        this.updatePluginInfo$.next();
        //unload
    }

    async uninstallAddon(name: string) {
        //lock

        await fse.remove(resolve(this.addonsDir, name));
        this.updatePluginInfo$.next();

    }
}

interface ComenAddonPackageJson {
    name: string;
    version: string;
    author: {
        name: string;
    };
    icon?: string;
    main?: string;
    comen: {
        displayName: string;
        overlays?: {
            name: string;
            displayName: string;
            icon?: string;
            load?: string;
        }[],
        sources?: {
            name: string;
            displayName: string;
            icon?: string;
            load?: string;
        }[]
    }
}