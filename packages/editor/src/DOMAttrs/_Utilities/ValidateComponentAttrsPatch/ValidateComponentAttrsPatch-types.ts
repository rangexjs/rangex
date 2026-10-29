import type {
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrsShape,
	ComponentAttrValidators,
} from "../DOMAttrs-types";

export interface ValidateComponentAttrsPatchParams<
	TComponentAttrsShape extends ComponentAttrsShape,
> {
	componentAttrsPatch: ComponentAttrsPatch<TComponentAttrsShape>;
	componentAttrsShape: TComponentAttrsShape;
	componentAttrValidators: ComponentAttrValidators<TComponentAttrsShape>;
}

export type ValidateComponentAttrsPatchResult<
	TComponentAttrsShape extends ComponentAttrsShape,
> = ComponentAttrsMismatch<TComponentAttrsShape> | null;
