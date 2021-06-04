import { serializeObjectToBase64, deserializeBase64 } from './base64';
import { TextDecoder, TextEncoder } from 'util';
import { SafeAny } from '@comen/common';

describe('configuration', () => {
    beforeAll(() => {
        // 测试体验极差🤮
        if (typeof (global as SafeAny).TextEncoder === 'undefined') {
            (global as SafeAny).TextEncoder = TextEncoder;
            (global as SafeAny).TextDecoder = TextDecoder;
        }
    });

    it('should be serialized and deserialized correctly', () => {
        const conf = {
            var1: 0,
            var2: 'test',
            var3: false,
            var4: {
                var5: 1,
                var6: {
                    var7: 'test2',
                    '!!!': '???',
                },
            },
        };

        const serialized = serializeObjectToBase64(conf);
        const ret = deserializeBase64<typeof conf>(serialized);

        expect(ret).toEqual(conf);
    });

    it('should work with blob attachments', () => {
        const conf = {
            blob: new Uint8Array(16).fill(0x99),
            nested: {
                blob2: new Uint8Array(32).fill(0x86),
            },
        };

        const serialized = serializeObjectToBase64(conf);
        const ret = deserializeBase64<SafeAny>(serialized);

        expect(ret).toEqual(conf);
    });
});
