import type { SelectParams, ValidateDisplayTextResult } from "#adapters/Mention";

export interface ValidateMentionDisplayTextParams {
	displayText: string;
}

export type ValidateMentionDisplayTextResult = ValidateDisplayTextResult;

export interface ValidateMentionPlacementParams extends SelectParams {}

export interface MentionPlacementMismatch {
	field: "userId" | "displayText";
	reason: string;
}

export type ValidateMentionPlacementResult = MentionPlacementMismatch | null;
