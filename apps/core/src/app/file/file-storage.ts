import { ComenFile, ComenFileConstraint } from "./file";

export abstract class FileStorage {

    abstract getList(): Promise<ComenFile[]>;

    abstract addNewFile(name: string, constraint: ComenFileConstraint): Promise<ComenFile>;

    abstract getFile(id: string): Promise<ComenFile>;

    abstract removeFile(file: ComenFile): Promise<void>;
}