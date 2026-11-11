import type { EditorElementDraft } from "@rangex/core";

import type { AnyElementAttrValidators, ElementAttrsShape } from "#dom-attrs";

import type { ValidateComponentResult } from "../../ValidateSnapshot-types";

export interface ResolveDraftDOMAttrsParams {
	rootDraft: EditorElementDraft;
	elementDraft: EditorElementDraft;
	elementAttrsShape: ElementAttrsShape;
	elementAttrValidators: AnyElementAttrValidators;
}

export type ResolveDraftDOMAttrsResult = ValidateComponentResult;
