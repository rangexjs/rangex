import type {
	BlockComponentDraft,
	BlockComponentLineDraft,
	BlockComponentLineSnapshot,
	BlockComponentTextHolderDraft,
	BlockComponentTextHolderSnapshot,
} from "@rangex/core";

import type { AnyElementAttrValidators, ElementAttrsShape } from "#dom-attrs";

import type { ValidateComponentResult } from "../../../ValidateSnapshot-types";

// Without domAttrs: they're resolved by the component's shape (see resolveDraftDOMAttrs)
export type BlockComponentLineState = Omit<
	BlockComponentLineSnapshot,
	"uniqueId" | "childNodes" | "domAttrs"
>;

export type BlockComponentTextHolderState = Omit<
	BlockComponentTextHolderSnapshot,
	"uniqueId" | "childNodes" | "domAttrs"
>;

export interface ValidateBlockComponentTextHolderParams {
	lineDraft: BlockComponentLineDraft;
	textHolderDraft: BlockComponentTextHolderDraft;
}

export type ValidateBlockComponentTextHolderResult = ValidateComponentResult;

export interface ValidateBlockComponentLineParams {
	blockComponentDraft: BlockComponentDraft;
	lineAttrsShape: ElementAttrsShape;
	lineAttrValidators: AnyElementAttrValidators;
}

export type ValidateBlockComponentLineResult = ValidateComponentResult;
