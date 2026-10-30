import { isUserId } from "#storage";
import type {
	ValidateMentionDisplayNameParams,
	ValidateMentionDisplayNameResult,
	ValidateMentionPlacementParams,
	ValidateMentionPlacementResult,
} from "./ValidateMentionPlacement-types";

/*
 * A display name is valid if it isn't empty. Returns the mismatch, or null when it's valid.
 */
export const validateMentionDisplayName = ({
	displayName,
}: ValidateMentionDisplayNameParams): ValidateMentionDisplayNameResult => {
	if (displayName === "") {
		return { reason: "must not be empty" };
	}

	return null;
};

/*
 * Validates whether a mention can be placed with the given params: its userId by the storage's rule (see isUserId), and
 * its displayName. Returns the first mismatch with its field's name, or null when they're valid.
 */
export const validateMentionPlacement = ({
	userId,
	displayName,
}: ValidateMentionPlacementParams): ValidateMentionPlacementResult => {
	if (!isUserId(userId)) {
		return { field: "userId", reason: "must be a valid user id" };
	}

	const displayNameFailed = validateMentionDisplayName({ displayName });

	if (displayNameFailed) {
		return { field: "displayName", reason: displayNameFailed.reason };
	}

	return null;
};
