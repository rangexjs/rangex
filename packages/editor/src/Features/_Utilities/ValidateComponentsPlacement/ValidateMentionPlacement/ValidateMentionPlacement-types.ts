import type {
	SelectParams,
	ValidateDisplayNameResult,
} from "#adapters/Mention";

export interface ValidateMentionDisplayNameParams {
	displayName: string;
}

export type ValidateMentionDisplayNameResult = ValidateDisplayNameResult;

export interface ValidateMentionPlacementParams extends SelectParams {}

export interface MentionPlacementMismatch {
	field: "userId" | "displayName";
	reason: string;
}

export type ValidateMentionPlacementResult = MentionPlacementMismatch | null;
