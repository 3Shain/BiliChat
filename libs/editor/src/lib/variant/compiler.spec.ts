import { generateCode } from './compiler';

describe('Compiler', () => {
    it('should works', () => {
        const testdata = {
            default: {
                a: 1,
                b: 2,
                c: 3
            },
            variants: [
                {
                    condition: [{
                        property: 'test',
                        method: 'gte',
                        target: 100
                    }],
                    property: {
                        a: 3,
                        c: 6
                    }
                },
                {
                    condition: [{
                        property: 'test2',
                        method: 'tct',
                        target: 'work'
                    }],
                    property: {
                        a: 7
                    }
                }
            ]
        };
        const fn = generateCode(testdata);
        const ret = fn({
            test: 0
        });
        expect(ret.a).toBe(1);
        const ret2 = fn({
            test: 101
        });
        expect(ret2.a).toBe(3);
        const ret3 = fn({
            test2: 'it works!'
        });
        expect(ret3.a).toBe(7);
    });
})