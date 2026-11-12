import type { CreateRootEditableParams } from "@rangex/core";

import type { rootTypes } from "./RootTypes";

export type RootTypes = typeof rootTypes;

export type RootType = RootTypes[keyof RootTypes];

export type RootDefinition = Pick<
	CreateRootEditableParams,
	| "display"
	| "editState"
	| "allowedComponents"
	| "allowedContentLineLocalNames"
	| "allowedContentLineStyleAttrNames"
	| "allowedGlyphFormatterStyleAttrNames"
	| "allowedGlyphFormatterInlineTags"
>;

export type RootDefinitions = Record<RootType, RootDefinition>;
