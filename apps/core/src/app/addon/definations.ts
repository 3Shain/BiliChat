import { Type } from '@angular/core';
import { ComenAddonMetadata } from '@comen/common';

export interface BuiltinOverlayModule {
    entry: Type<any>;
    metadata: ComenAddonMetadata;
}

export interface BuiltinSourceModule {
    source: Type<any>;
}

export interface OverlayInfo {
    name: string;
    displayName: string;
    version: string;
    icon?: string;
    description?: string;
    preload: () => Promise<void>;
}

export interface SourceInfo {
    name: string;
    version: string;
    displayName: string;
    icon?: string;
    description?: string;
    preload: () => Promise<void>;
}
