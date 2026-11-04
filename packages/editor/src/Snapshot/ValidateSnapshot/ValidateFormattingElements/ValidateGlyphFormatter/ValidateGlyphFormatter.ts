import {
	isBackgroundColorStructuredStyle,
	isColorStructuredStyle,
	isFontFamilyStructuredStyle,
	isFontSizeStructuredStyle,
	isLetterSpacingStructuredStyle,
} from "#structured-style";
import { matchJSON, optional } from "#utilities";
import { describeJSONMismatch } from "../../_Utilities";
import type {
	ValidateGlyphFormatterParams,
	ValidateGlyphFormatterResult,
} from "./ValidateGlyphFormatter-types";

// A style the engine allows but the editor never sets: invalid whatever its value
const isUnsupportedStructuredStyle = () => {
	return false;
};

const glyphFormatterStructuredStylePattern = {
	backgroundColor: { [optional]: isBackgroundColorStructuredStyle },
	color: { [optional]: isColorStructuredStyle },
	fontFamily: { [optional]: isFontFamilyStructuredStyle },
	fontSize: { [optional]: isFontSizeStructuredStyle },
	fontStyle: { [optional]: isUnsupportedStructuredStyle },
	fontWeight: { [optional]: isUnsupportedStructuredStyle },
	letterSpacing: { [optional]: isLetterSpacingStructuredStyle },
	textDecoration: { [optional]: isUnsupportedStructuredStyle },
};

/*
 * Validates a GlyphFormatter's structuredStyle: it may only hold the styles the editor sets, each valid by its
 * is*StructuredStyle check. Everything else on it is checked by the engine's validation.
 */
export const validateGlyphFormatter = ({
	glyphFormatterDraft,
}: ValidateGlyphFormatterParams): ValidateGlyphFormatterResult => {
	const { structuredStyle } = glyphFormatterDraft;

	const state = { structuredStyle };

	const mismatch = matchJSON({
		value: state,
		pattern: { structuredStyle: glyphFormatterStructuredStylePattern },
	});

	if (mismatch) {
		return {
			sourceSnapshot: glyphFormatterDraft,
			failedSnapshot: glyphFormatterDraft,
			reason: describeJSONMismatch({
				rootDraft: glyphFormatterDraft,
				nodeDraft: glyphFormatterDraft,
				value: state,
				mismatch,
			}),
		};
	}

	return null;
};
