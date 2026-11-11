import type { GlyphFormatterDraft } from "@rangex/core";

import type { ValidateComponentResult } from "../../ValidateSnapshot-types";

export interface ValidateGlyphFormatterParams {
	glyphFormatterDraft: GlyphFormatterDraft;
}

export type ValidateGlyphFormatterResult = ValidateComponentResult;
