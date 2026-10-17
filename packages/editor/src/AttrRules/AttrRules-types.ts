/*
 * An attribute rule's failure. The fallback replaces the invalid value; null removes the attribute, or fails the node
 * if the attribute is required.
 */
export interface AttrRuleFailed {
	reason: string;
	fallback: string | null;
}

export interface ValidateAttrParams {
	value: string;
}

export type ValidateAttrResult = AttrRuleFailed | null;

export type ValidateAttrFn = (params: ValidateAttrParams) => ValidateAttrResult;

/*
 * Decides whether an attribute's value is valid. A required attribute can't be missing.
 */
export interface AttrRule {
	required: boolean;
	validate: ValidateAttrFn;
}

/*
 * A node's AttrRules by attribute name. Closed: an attribute without a rule (or with an undefined one) is invalid.
 */
export type AttrRules = Partial<Record<string, AttrRule>>;
