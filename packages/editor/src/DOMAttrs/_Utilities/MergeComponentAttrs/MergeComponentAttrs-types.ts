import type { ComponentAttrs, ComponentAttrsPatch, ComponentAttrsShape } from "../DOMAttrs-types";

export interface MergeComponentAttrsParams<TComponentAttrsShape extends ComponentAttrsShape> {
	componentAttrs: ComponentAttrs<TComponentAttrsShape>;
	componentAttrsPatch: ComponentAttrsPatch<TComponentAttrsShape>;
}

export type MergeComponentAttrsResult<TComponentAttrsShape extends ComponentAttrsShape> =
	ComponentAttrs<TComponentAttrsShape>;
