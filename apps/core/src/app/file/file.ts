import { SafeAny } from "@comen/common";

export interface ComenFileConstraint {
    name: string;
    version: string;
}

export interface ComenFile {
    readonly id:string;
    readonly name: string;
    readonly constraint: {
        name: string;
        version: string;
    };
    readonly lastModified: number;
    getData(): Promise<SafeAny>;
    storeData(data: SafeAny, constraint: ComenFileConstraint): Promise<void>;
    rename(newName: string): Promise<void>;
}