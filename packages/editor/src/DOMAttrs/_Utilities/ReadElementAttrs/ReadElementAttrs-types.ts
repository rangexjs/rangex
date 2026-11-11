import type { EditorElement } from "@rangex/core";
import type { ElementAttrs, ElementAttrsShape } from "../DOMAttrs-types";

export interface ReadElementAttrsParams<
	TElementAttrsShape extends ElementAttrsShape,
> {
	element: EditorElement;
	elementAttrsShape: TElementAttrsShape;
}

export type ReadElementAttrsResult<
	TElementAttrsShape extends ElementAttrsShape,
> = ElementAttrs<TElementAttrsShape>;
