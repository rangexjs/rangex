import { isCodeBlockLanguage, isCodeBlockTheme, maxCodeBlockNameLength } from "#storage";

import type {
	ValidateCodeBlockLanguageParams,
	ValidateCodeBlockLanguageResult,
	ValidateCodeBlockPlacementParams,
	ValidateCodeBlockPlacementResult,
	ValidateCodeBlockThemeParams,
	ValidateCodeBlockThemeResult,
} from "./ValidateCodeBlockPlacement-types";

/*
 * Validates a language by the storage's rule (see isCodeBlockLanguage). Returns the mismatch, or null when it's valid.
 */
export const validateCodeBlockLanguage = ({
	language,
}: ValidateCodeBlockLanguageParams): ValidateCodeBlockLanguageResult => {
	if (!isCodeBlockLanguage(language)) {
		return {
			reason: `must not be empty, and at most ${maxCodeBlockNameLength} characters long`,
		};
	}

	return null;
};

/*
 * Validates a theme by the storage's rule (see isCodeBlockTheme). Returns the mismatch, or null when it's valid.
 */
export const validateCodeBlockTheme = ({
	theme,
}: ValidateCodeBlockThemeParams): ValidateCodeBlockThemeResult => {
	if (!isCodeBlockTheme(theme)) {
		return {
			reason: `its names must not be empty, and at most ${maxCodeBlockNameLength} characters long`,
		};
	}

	return null;
};

/*
 * Validates whether a CodeBlock can be placed (inserted, wrapped or turned into) with the given language and theme. Its
 * attributes aren't given: the highlighter sets them. Returns the first mismatch with its field's name, or null when
 * they're valid.
 */
export const validateCodeBlockPlacement = ({
	language,
	theme,
}: ValidateCodeBlockPlacementParams): ValidateCodeBlockPlacementResult => {
	const languageFailed = validateCodeBlockLanguage({ language });

	if (languageFailed) {
		return { field: "language", reason: languageFailed.reason };
	}

	const themeFailed = validateCodeBlockTheme({ theme });

	if (themeFailed) {
		return { field: "theme", reason: themeFailed.reason };
	}

	return null;
};
