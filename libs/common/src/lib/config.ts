import { SafeAny } from './comen';

export interface PropertySchema {
    type:
        | 'number'
        | 'text'
        | 'color'
        | 'background'
        | 'margin'
        | 'border'
        | 'range'
        | 'switch'
        | 'font'
        | 'outline'
        | 'radius'
        | 'shadow'
        | 'list';
    displayName: string;
    'x-icon'?: string | any;
    defaultValue: SafeAny;
    dependsOn?: string[];
    exclusive?: string[];
    validation?: SafeAny;
    extra?: SafeAny;
}

export interface ConfigurationSection {
    displayName: string;
    previewSelector?: string;
    level: number; // use flat layout other than object.
    'x-icon'?: string | any;
    properties: {
        [key: string]: PropertySchema;
    };
    defaultValue: SafeAny;
    variantProperties?: SafeAny[];
}

export interface ComenAddonConfiguration {
    displayName: string;
    preset?: {
        viewport?: {
            width: number;
            height: number;
        };
    };
    sections: {
        [key: string]: ConfigurationSection;
    };
}

export namespace ComenControlTypes {
    export interface Font {
        font: string;
        size: number;
        weight: string;
        space: number | null;
        lineHeight: number | null;
        textAlign: 'left' | 'center' | 'right';
        italic: boolean;
        underline: boolean;
        strikeThrough: boolean;
    }

    export const DEFAULT_FONT: Font = {
        font: '',
        size: 14,
        weight: 'normal',
        space: null,
        lineHeight: null,
        textAlign: 'left',
        italic: false,
        underline: false,
        strikeThrough: false,
    };

    export interface Outline {
        width: number;
        color: string;
    }

    export interface BoxShadow {
        x: number;
        y: number;
    }

    export type Margin = [number, number, number, number];
    export type Padding = [number, number, number, number];

    export interface Radius {}
}
