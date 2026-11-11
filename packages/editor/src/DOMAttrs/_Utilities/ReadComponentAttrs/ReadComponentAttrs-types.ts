import type { ComponentAttrs, ComponentAttrsShape, ComponentElements } from "../DOMAttrs-types";

export interface ReadComponentAttrsParams<TComponentAttrsShape extends ComponentAttrsShape> {
	componentElements: ComponentElements<TComponentAttrsShape>;
	componentAttrsShape: TComponentAttrsShape;
}

export type ReadComponentAttrsResult<TComponentAttrsShape extends ComponentAttrsShape> =
	ComponentAttrs<TComponentAttrsShape>;
