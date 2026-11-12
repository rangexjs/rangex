import type { ContentLineDraft } from "@rangex/core";

import type { ValidateComponentResult } from "../../ValidateSnapshot-types";

export interface ValidateContentLineParams {
	contentLineDraft: ContentLineDraft;
}

export type ValidateContentLineResult = ValidateComponentResult;
