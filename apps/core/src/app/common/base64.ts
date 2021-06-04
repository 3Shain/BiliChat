import { SafeAny } from '@comen/common';
import { toByteArray, fromByteArray } from 'base64-js';
import { inflate, deflate } from 'pako';

export function deserializeBase64<T = SafeAny>(
    dataString: string
): T {
    if (dataString == null) {
        throw new Error('dataString should not be null');
    }

    const buffer = toByteArray(dataString);
    // resolve buffer
    return deserializeBuffer(buffer);
}

export function deserializeBuffer(buffer: Uint8Array) {
    /**
     * 2 bytes | 2 bytes | 4 bytes    | vary             | 4 bytes     |  vary
     * magic 3S| reserved| raw length | raw datas (blobs)| json length |  json body 
     */

    const dataView = new DataView(buffer.buffer);
    dataView.getInt16(0); // assert ascii 3S
    dataView.getUint16(2); // reserved
    const rawOffset = 8;
    const jsonOffset = dataView.getUint32(4) + 12;
    const json = JSON.parse(new TextDecoder().decode(
        buffer.slice(jsonOffset, dataView.getUint32(jsonOffset))));

    function travelObject(obj: SafeAny) {
        for (const props in obj) {
            if (typeof obj[props] == 'string') {
                if ((obj[props] as string).startsWith('@@raw:')) {
                    const segs = (obj[props] as string).split(':');
                    // assert length == 3
                    obj[props] = inflate(new Uint8Array(buffer.buffer, rawOffset + parseInt(segs[1]), parseInt(segs[2]))); // replace
                }
            } else if (typeof obj[props] == 'object') {
                travelObject(obj[props]);
            }
        }
        return obj;
    }
    return travelObject(json);
}

export function serializeObjectToBase64<T = SafeAny>(
    config: T
) {
    return fromByteArray(serializeObjectToBuffer(config));
}

export function serializeObjectToBuffer<T = SafeAny>(
    object: T
) {
    const buffer = new Uint8Array(16 * 1024 * 1024); // 16MiB
    let length = 4;
    const dataView = new DataView(buffer.buffer);
    dataView.setUint32(0, 0x33530000);

    let rawLen = 0;

    // TODO: iterate attachments
    function travelObject(obj: SafeAny) {
        const cloned = {};
        for (const props in obj) {
            if (obj[props] instanceof Uint8Array) {
                const ziped = deflate(obj[props] as Uint8Array);
                const uLen = ziped.byteLength;
                buffer.set(ziped, rawLen + 8);
                cloned[props] = `@@raw:${rawLen}:${uLen}`;
                rawLen += uLen;
            } else if (typeof obj[props] == 'object') {
                cloned[props] = travelObject(obj[props]);
            } else {
                cloned[props] = obj[props];
            }
        }
        return cloned;
    }
    const iterated = travelObject(object);
    dataView.setUint32(4, rawLen);
    const jsonStr = JSON.stringify(iterated);
    const jsonBuffer = (new TextEncoder().encode(jsonStr));
    length += rawLen + 4;
    dataView.setUint32(4, rawLen);
    dataView.setUint32(rawLen + 8, jsonBuffer.byteLength);
    buffer.set(jsonBuffer, rawLen + 12);
    length += jsonBuffer.byteLength + 4;
    return buffer.slice(0, length);
}