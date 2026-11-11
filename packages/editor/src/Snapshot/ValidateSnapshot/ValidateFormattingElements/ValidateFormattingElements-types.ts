import type { RootEditableDraft } from "@rangex/core";

import type { ValidateComponentResult } from "../ValidateSnapshot-types";

export interface ValidateFormattingElementsParams {
	rootEditableDraft: RootEditableDraft;
}

export type ValidateFormattingElementsResult = ValidateComponentResult;
