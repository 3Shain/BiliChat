import { EditorAssetStorage } from "@comen/editor";
import { nanoid } from 'nanoid';

const MAX_STORAGE_SIZE = 2 * 1024 * 1024;

export class InMemoryStorage implements EditorAssetStorage {

    readonly storage: {
        [key: string]: {
            blob?: Blob,
            url: string
        }
    } = {};

    // mutable size
    size$ = 0;

    
    getUrl(id: string) {
        if (id in this.storage) {
            return this.storage[id].url;
        }
        throw 'not found';
    }

    store(blob: Blob) {
        const currentSize = Object.values(this.storage).reduce((a, b) => { return a + b.blob?.size ?? 0 }, 0);
        if (blob.size + currentSize > MAX_STORAGE_SIZE) {
            throw 'space limit';
        }
        const url = URL.createObjectURL(blob);
        const id = nanoid();
        this.storage[id] = {
            blob,
            url
        };
        return id;
    }

    remove(id: string) {
        if (id in this.storage) {
            this.storage[id].blob && URL.revokeObjectURL(this.storage[id].url);
            delete this.storage[id];
        }
        throw 'not found';
    }

    load() {

    }
}