import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsShape,
	ComponentAttrValidators,
} from "../DOMAttrs-types";

export interface ValidateComponentAttrsParams<TComponentAttrsShape extends ComponentAttrsShape> {
	componentAttrs: ComponentAttrs<TComponentAttrsShape>;
	componentAttrsShape: TComponentAttrsShape;
	componentAttrValidators: ComponentAttrValidators<TComponentAttrsShape>;
}

export type ValidateComponentAttrsResult<
	TComponentAttrsShape extends ComponentAttrsShape,
> = ComponentAttrsMismatch<TComponentAttrsShape> | null;
