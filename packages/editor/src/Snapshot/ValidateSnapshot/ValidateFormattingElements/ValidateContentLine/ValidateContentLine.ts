import {
	isLineHeightStructuredStyle,
	isPaddingBlockStructuredStyle,
	isPaddingInlineStructuredStyle,
	isTextAlignStructuredStyle,
	isTextIndentStructuredStyle,
} from "#structured-style";
import { matchJSON, optional } from "#utilities";
import { describeJSONMismatch } from "../../_Utilities";
import type {
	ValidateContentLineParams,
	ValidateContentLineResult,
} from "./ValidateContentLine-types";

const contentLineStructuredStylePattern = {
	lineHeight: { [optional]: isLineHeightStructuredStyle },
	paddingBlock: { [optional]: isPaddingBlockStructuredStyle },
	paddingInline: { [optional]: isPaddingInlineStructuredStyle },
	textAlign: { [optional]: isTextAlignStructuredStyle },
	textIndent: { [optional]: isTextIndentStructuredStyle },
};

/*
 * Validates a ContentLine's structuredStyle: it may only hold the styles the editor sets, each valid by its
 * is*StructuredStyle check. Everything else on it is checked by the engine's validation.
 */
export const validateContentLine = ({
	contentLineDraft,
}: ValidateContentLineParams): ValidateContentLineResult => {
	const { structuredStyle } = contentLineDraft;

	const state = { structuredStyle };

	const mismatch = matchJSON({
		value: state,
		pattern: { structuredStyle: contentLineStructuredStylePattern },
	});

	if (mismatch) {
		return {
			sourceSnapshot: contentLineDraft,
			failedSnapshot: contentLineDraft,
			reason: describeJSONMismatch({
				rootDraft: contentLineDraft,
				nodeDraft: contentLineDraft,
				value: state,
				mismatch,
			}),
		};
	}

	return null;
};
