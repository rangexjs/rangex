import { isUserId } from "#storage";

import type {
	ValidateMentionDisplayTextParams,
	ValidateMentionDisplayTextResult,
	ValidateMentionPlacementParams,
	ValidateMentionPlacementResult,
} from "./ValidateMentionPlacement-types";

/*
 * A display text is valid if it isn't empty. Returns the mismatch, or null when it's valid.
 */
export const validateMentionDisplayText = ({
	displayText,
}: ValidateMentionDisplayTextParams): ValidateMentionDisplayTextResult => {
	if (displayText === "") {
		return { reason: "must not be empty" };
	}

	return null;
};

/*
 * Validates whether a mention can be placed with the given params: its userId by the storage's rule (see isUserId), and
 * its displayText. Returns the first mismatch with its field's name, or null when they're valid.
 */
export const validateMentionPlacement = ({
	userId,
	displayText,
}: ValidateMentionPlacementParams): ValidateMentionPlacementResult => {
	if (!isUserId(userId)) {
		return { field: "userId", reason: "must be a valid user id" };
	}

	const displayTextFailed = validateMentionDisplayText({ displayText });

	if (displayTextFailed) {
		return { field: "displayText", reason: displayTextFailed.reason };
	}

	return null;
};
