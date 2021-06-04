import { Observable } from 'rxjs';
import { ComenAddonConfiguration } from './config';
import { Message } from './message';

// eslint-disable-next-line
export type SafeAny = any;

export type ComenAddonMetadata = {
    name: string;
    displayName: string;
    editable: boolean;
    configuration: ComenAddonConfiguration;
};

export interface ComenAddonInstance {
    message(): Observable<Message>;
    config(section: string): Observable<SafeAny>;
    variantPipe(section: string): Observable<SafeAny>;
    rootElement: SafeAny;
}

export type ComenOverlayEntry = (instance: ComenAddonInstance) => Function;

declare global {
    export function registerOverlay(
        metadata: ComenAddonMetadata,
        entry: ComenOverlayEntry
    ): void;
}

export abstract class ComenEnvironmentHost {
    abstract message(): Observable<Message>;
    abstract config(section: string): Observable<SafeAny>;
    abstract variantPipe(section: string): Observable<SafeAny>;
    abstract assetUrl(id: string): string;
}
