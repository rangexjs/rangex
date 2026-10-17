import type { AttrRule, AttrRules } from "../AttrRules-types";

export interface AnchorAttrRules extends AttrRules {
	href?: AttrRule;
	target?: AttrRule;
}

/*
 * The Link's AttrRules by node name
 */
export interface LinkAttrRules {
	anchor: AnchorAttrRules;
}

export interface CreateLinkAttrRulesParams {
	anchor?: AnchorAttrRules;
}

export type CreateLinkAttrRulesResult = LinkAttrRules;
