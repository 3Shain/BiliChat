import { SafeAny } from "./comen";

export class VariantProperty {
    type: "number" | "text" | "boolean";
    displayName: string;
    name: string;
    "x-icon"?: string;
    defaultValue?: SafeAny;
    // enum extra
}

export class VariantCompareMethod {
    displayName: string;
    name: string;
    targetType: "number" | "text" | "boolean";
}

export class VariantCondition {
    property: string;
    method: string;
    target: SafeAny;
}

export const TEXT_MESSAGE_VARIANTS = [
    {
        type: "string",
        displayName: "用户名",
        name: "username"
    }
]

export const TEXT_COMPARE_METHOD = [
    {
        displayName: "包含",
        name: "tct",
        targetType: "text"
    },
    {
        displayName: "不包含",
        name: "tnct",
        targetType: "text"
    },
    {
        displayName: "等于",
        name: "teq",
        targetType: "text"
    }
]

export const NUMBER_COMPARE_METHOD = [
    {
        displayName: "大于",
        name: "gt",
        targetType: "number"
    }, {
        displayName: "大于等于",
        name: "gte",
        targetType: "number"
    }, {
        displayName: "小于",
        name: "lt",
        targetType: "number"
    }, {
        displayName: "小于等于",
        name: "lte",
        targetType: "number"
    }, {
        displayName: "等于",
        name: "eq",
        targetType: "number"
    }, {
        displayName: "不等于",
        name: "neq",
        targetType: "number"
    }
]

export const BOOL_COMPARE_METHOD = [
    {
        displayName: "",
        name: "isTrue",
        targetType: "boolean"
    }
]

export const ALL_COMPARE_METHOD = [
    ...TEXT_COMPARE_METHOD,
    ...NUMBER_COMPARE_METHOD,
    ...BOOL_COMPARE_METHOD
]

/** infact you can edit property here  */
export const COMPARE_METHOD_MAP = {
    "text": TEXT_COMPARE_METHOD,
    "number": NUMBER_COMPARE_METHOD,
    "boolean": BOOL_COMPARE_METHOD
}

export const COMPARE_METHOD_DEFAULT_VALUE = {
    "text": "",
    "number": 0,
    "boolean": true
}

export function formatConditionString(conditon: VariantCondition, schemas: VariantProperty[]) {
    const compareMethod = ALL_COMPARE_METHOD.find(x => x.name == conditon.method);
    const schema = schemas.find(x => x.name == conditon.property);
    // assert exist
    return `${schema.displayName}${compareMethod.displayName}${conditon.target}`;
}