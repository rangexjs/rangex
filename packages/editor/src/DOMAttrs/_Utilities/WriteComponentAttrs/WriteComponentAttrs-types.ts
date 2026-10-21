import type {
	ComponentAttrs,
	ComponentAttrsShape,
	ComponentElements,
} from "../DOMAttrs-types";

export interface WriteComponentAttrsParams<
	TComponentAttrsShape extends ComponentAttrsShape,
> {
	componentElements: ComponentElements<TComponentAttrsShape>;
	componentAttrs: ComponentAttrs<TComponentAttrsShape>;
}
