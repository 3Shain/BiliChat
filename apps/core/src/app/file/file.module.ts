import { ModuleWithProviders, NgModule } from '@angular/core';
import { FileStorage } from './file-storage';
import { IdbFileStorage } from './idb-file-storage';

@NgModule()
export class FileModule {
    static forRoot(): ModuleWithProviders<FileModule> {
        return {
            ngModule: FileModule,
            providers: [
                {
                    provide: FileStorage,
                    useClass: IdbFileStorage
                }
            ]
        }
    }
}