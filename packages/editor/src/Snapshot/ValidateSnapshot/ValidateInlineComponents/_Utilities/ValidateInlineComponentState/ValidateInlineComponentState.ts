import { matchJSON } from "#utilities";
import { describeJSONMismatch } from "../../../_Utilities";
import type {
	InlineComponentState,
	ValidateInlineComponentStateParams,
	ValidateInlineComponentStateResult,
} from "./ValidateInlineComponentState-types";

/*
 * Matches an InlineComponent's editorRole, name, content, editState, shouldSelect*, domAttrs and customStorage props
 * against the pattern its component expects. Fails on the first prop that doesn't match.
 */
export const validateInlineComponentState = ({
	inlineComponentDraft,
	expectedState,
}: ValidateInlineComponentStateParams): ValidateInlineComponentStateResult => {
	const {
		editorRole,
		name,
		content,
		editState,
		shouldSelectBeforeRemove,
		shouldSelectOnNavigation,
		domAttrs,
		customStorage,
	} = inlineComponentDraft;

	const state: InlineComponentState = {
		editorRole,
		name,
		content,
		editState,
		shouldSelectBeforeRemove,
		shouldSelectOnNavigation,
		domAttrs,
		customStorage,
	};

	const mismatch = matchJSON({ value: state, pattern: expectedState });

	if (mismatch) {
		return {
			sourceSnapshot: inlineComponentDraft,
			failedSnapshot: inlineComponentDraft,
			reason: describeJSONMismatch({
				rootDraft: inlineComponentDraft,
				nodeDraft: inlineComponentDraft,
				value: state,
				mismatch,
			}),
		};
	}

	return null;
};
