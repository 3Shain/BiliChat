import { ComenFile, ComenFileConstraint } from "./file";
import { openDB } from 'idb';
import { FileStorage } from "./file-storage";
import { nanoid } from "nanoid";
import { SafeAny } from "@comen/common";
import { Injectable } from "@angular/core";

const DB_NAME = 'comen_local_db';

async function _openDb() {
    return await openDB(DB_NAME, 1, {
        upgrade: (db, _, newv) => {
            switch (newv) {
                case 1: {
                    db.createObjectStore('comen_storage');
                    db.createObjectStore('comen_files');
                }
            }
        }
    })
}

class IdbComenFile implements ComenFile {

    constructor(
        public id: string,
        public name: string,
        public constraint: {
            name: string;
            version: string
        },
        public lastModified: number
    ) { }

    async getData() {
        const db = await _openDb();
        const ret = await db.get('comen_storage', this.id);
        db.close();
        return ret;
    }

    async storeData(data: SafeAny, constraint: ComenFileConstraint) {
        const db = await _openDb();
        Object.assign(this.constraint, constraint);
        await db.put('comen_storage', data, this.id);
        this.lastModified = Date.now();
        await db.put('comen_files', {
            id: this.id,
            name: this.name,
            constraint: constraint,
            lastModified: this.lastModified
        }, this.id);
        db.close();
    }

    async rename(newname: string) {
        const db = await _openDb();
        this.lastModified = Date.now();
        this.name = newname;
        await db.put('comen_files', {
            id: this.id,
            name: this.name,
            constraint: this.constraint,
            lastModified: this.lastModified
        }, this.id);
        db.close();
    }
}

@Injectable()
export class IdbFileStorage extends FileStorage {

    async getList() {
        const db = await _openDb();
        const ret = await db.getAll('comen_files');
        db.close();
        return ret.map((x) => {
            return new IdbComenFile(
                x.id,
                x.name,
                x.constraint,
                x.lastModified
            )
        });
    }

    async getFile(id: string) {
        const db = await _openDb();
        const x = await db.get('comen_files', id);
        db.close();
        return new IdbComenFile(
            x.id,
            x.name,
            x.constraint,
            x.lastModified
        );
    }

    async removeFile(file: IdbComenFile) {
        const db = await _openDb();
        await db.delete('comen_storage', file.id);
        await db.delete('comen_files', file.id);
        db.close();
    }

    async addNewFile(name: string, constraint: ComenFileConstraint) {
        const db = await _openDb();
        const id = nanoid();
        await db.add('comen_storage', null, id);
        await db.add('comen_files', {
            id,
            name: name,
            constraint,
            lastModified: Date.now()
        }, id);
        return new IdbComenFile(
            id,
            name,
            constraint,
            Date.now()
        );
    }
}