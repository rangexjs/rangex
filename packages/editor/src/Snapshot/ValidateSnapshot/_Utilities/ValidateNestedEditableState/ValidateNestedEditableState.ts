import { matchJSON } from "#utilities";

import { describeJSONMismatch } from "../Utilities";
import type {
	NestedEditableState,
	ValidateNestedEditableStateParams,
	ValidateNestedEditableStateResult,
} from "./ValidateNestedEditableState-types";

/*
 * Matches a NestedEditable's editorRole, display, editState, allowed* settings, domAttrs and customStorage props
 * against the pattern its component expects. Fails on the first prop that doesn't match. Its content is left to the
 * engine's validation, which checks it by these settings.
 */
export const validateNestedEditableState = ({
	componentDraft,
	nestedEditableDraft,
	expectedState,
}: ValidateNestedEditableStateParams): ValidateNestedEditableStateResult => {
	const {
		editorRole,
		display,
		editState,
		allowedComponents,
		allowedContentLineLocalNames,
		allowedContentLineStyleAttrNames,
		allowedGlyphFormatterStyleAttrNames,
		allowedGlyphFormatterInlineTags,
		domAttrs,
		customStorage,
	} = nestedEditableDraft;

	const state: NestedEditableState = {
		editorRole,
		display,
		editState,
		allowedComponents,
		allowedContentLineLocalNames,
		allowedContentLineStyleAttrNames,
		allowedGlyphFormatterStyleAttrNames,
		allowedGlyphFormatterInlineTags,
		domAttrs,
		customStorage,
	};

	const mismatch = matchJSON({ value: state, pattern: expectedState });

	if (mismatch) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: nestedEditableDraft,
			reason: describeJSONMismatch({
				rootDraft: componentDraft,
				nodeDraft: nestedEditableDraft,
				value: state,
				mismatch,
			}),
		};
	}

	return null;
};
