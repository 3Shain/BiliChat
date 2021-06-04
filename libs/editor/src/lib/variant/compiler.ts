import { SafeAny, VariantCondition } from '@comen/common';
import * as esgen from 'escodegen';
import * as estree from 'estree';

export type CustomConditionExpressionGenerator =
    (operateExpression: estree.Expression, method: string, target: SafeAny) => estree.Expression;
export const CUSTEM_CONDITION_EXPRESSION_GENERATOR: {
    [key: string]: CustomConditionExpressionGenerator
} = {};

const BINARY_OPERATIONS_MAP = {
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    eq: '===',
    neq: '!=='
}

function ensureAccessable(target: estree.Expression, expression: estree.Expression) {
    return {
        type: 'ConditionalExpression',
        test: target,
        consequent: expression,
        alternate: {
            type: 'Literal',
            value: false
        }
    } as estree.ConditionalExpression;
}

function generateStringConditionExpression(operateExpression: estree.Expression, method: string, target: SafeAny): estree.Expression {
    switch (method) {
        case 'tnct':
            return {
                type: 'BinaryExpression',
                operator: '==',
                left: {
                    type: 'CallExpression',
                    optional: false,
                    callee: {
                        type: 'MemberExpression',
                        object: operateExpression,
                        optional: false,
                        property: {
                            type: 'Identifier',
                            name: 'indexOf'
                        },
                        computed: false
                    },
                    arguments: [
                        generateObjectExpression(target)
                    ]
                },
                right: generateObjectExpression(-1)
            }
        case 'tct':
            return {
                type: 'BinaryExpression',
                operator: '!=',
                left: {
                    type: 'CallExpression',
                    optional: false,
                    callee: {
                        type: 'MemberExpression',
                        object: operateExpression,
                        optional: false,
                        property: {
                            type: 'Identifier',
                            name: 'indexOf'
                        },
                        computed: false
                    },
                    arguments: [
                        generateObjectExpression(target)
                    ]
                },
                right: generateObjectExpression(-1)
            }
        case 'teq':
            return {
                type: 'BinaryExpression',
                operator: '==',
                left: operateExpression,
                right: {
                    type: 'Literal',
                    value: target
                }
            }
        case 'tstart':
            return {
                type: 'CallExpression',
                optional: true,
                callee: {
                    type: 'MemberExpression',
                    object: operateExpression,
                    optional: false,
                    property: {
                        type: 'Identifier',
                        name: 'startsWith'
                    },
                    computed: false
                },
                arguments: [
                    generateObjectExpression(target)
                ]
            };
        case 'tend':
            return {
                type: 'CallExpression',
                optional: true,
                callee: {
                    type: 'MemberExpression',
                    object: operateExpression,
                    optional: true,
                    property: {
                        type: 'Identifier',
                        name: 'endsWith'
                    },
                    computed: false
                },
                arguments: [
                    generateObjectExpression(target)
                ]
            }
    }
}

function generateObjectExpression(constObject: SafeAny): estree.Expression {
    if (typeof constObject == 'string' || typeof constObject == 'number'
        || typeof constObject == 'bigint' || typeof constObject == 'boolean') {
        if (typeof constObject == 'number' && constObject < 0) {
            return {
                type: 'UnaryExpression',
                operator: '-',
                prefix: true,
                argument: {
                    type: 'Literal',
                    value: -constObject
                }
            }
        }
        return {
            type: 'Literal',
            value: constObject
        } as estree.Literal;
    }
    else if (typeof constObject == 'object') {
        if (constObject instanceof Array) {
            return {
                type: 'ArrayExpression',
                elements: constObject.map(generateObjectExpression)
            }
        }
        if (constObject === null) {
            return {
                type: 'Literal',
                value: null
            }
        }
        return {
            type: 'ObjectExpression',
            properties: Object.entries(constObject).map(([key, value]) => {
                return {
                    type: 'Property',
                    key: {
                        type: 'Literal',
                        value: key
                    },
                    value: generateObjectExpression(value)
                } as estree.Property;
            })
        }
    } else if (constObject === undefined) {
        return {
            type: 'Identifier',
            name: 'undefined'
        }
    }
    else {
        console.log(constObject);
        throw 'NOT EXPECTED VALUE TYPE';
    }

}

function generateConditionExpression(condition: VariantCondition): estree.Expression {
    return ensureAccessable({
        type: 'MemberExpression',
        object: {
            type: 'Identifier',
            name: 'c'
        },
        property: {
            type: 'Literal',
            value: condition.property
        },
        computed: true,
        optional: false
    }, (() => {
        const operatee = {
            type: 'MemberExpression',
            object: {
                type: 'Identifier',
                name: 'c'
            },
            property: {
                type: 'Literal',
                value: condition.property
            },
            computed: true,
            optional: false
        } as estree.MemberExpression;
        // TODO: allow extension!
        if (CUSTEM_CONDITION_EXPRESSION_GENERATOR[condition.method]) {
            CUSTEM_CONDITION_EXPRESSION_GENERATOR[condition.method](operatee, condition.method, condition.target);
        }
        if (BINARY_OPERATIONS_MAP[condition.method]) {
            return {
                type: 'BinaryExpression',
                operator: BINARY_OPERATIONS_MAP[condition.method],
                left: operatee,
                right: {
                    type: 'Literal',
                    value: condition.target
                } as estree.Literal,
            } as estree.BinaryExpression
        } else {
            return generateStringConditionExpression(operatee, condition.method, condition.target);
        }
    })());
}

function generateVariantConditions(conditions: VariantCondition[]): estree.Expression {
    if (conditions.length == 0) {
        return {
            type: 'Literal',
            value: true
        }
    } else if (conditions.length == 1) {
        return generateConditionExpression(conditions[0]);
    }
    return {
        type: 'LogicalExpression',
        operator: '&&',
        left: generateConditionExpression(conditions[0]),
        right: generateVariantConditions(conditions.slice(1))
    }
}

function generateVariantStatements(variants: {
    condition: VariantCondition[],
    properties: SafeAny
}[]) {
    return variants.map(variant => {
        return {
            type: 'IfStatement',
            test: generateVariantConditions(variant.condition),
            consequent: {
                type: 'ExpressionStatement',
                expression: {
                    type: 'CallExpression',
                    callee: {
                        type: 'MemberExpression',
                        object: {
                            type: 'Identifier',
                            name: 'Object'
                        },
                        property: {
                            type: 'Identifier',
                            name: 'assign'
                        }
                    },
                    arguments: [
                        {
                            type: 'Identifier',
                            name: 'r'
                        },
                        generateObjectExpression(variant.properties)
                    ]
                }
            }
        } as estree.IfStatement
    });
}

export function generateCode(encode: {
    default: SafeAny,
    variants: {
        condition: VariantCondition[],
        properties: SafeAny
    }[]
}) {
    const statement = [
        {
            type: 'VariableDeclaration',
            declarations: [{
                type: 'VariableDeclarator',
                id: {
                    type: 'Identifier',
                    name: 'r'
                },
                init: generateObjectExpression(encode.default)
            }],
            kind: 'var'
        },
        ...generateVariantStatements(encode.variants),
        {
            type: 'ReturnStatement',
            argument: {
                type: 'Identifier',
                name: 'r'
            }
        }
    ].map(s => esgen.generate(s, { format: { compact: true } })).join('');
    return statement;
}