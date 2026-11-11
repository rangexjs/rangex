import { matchJSON } from "#utilities";

import { describeJSONMismatch } from "../../../_Utilities";
import type {
	BlockComponentState,
	ValidateBlockComponentStateParams,
	ValidateBlockComponentStateResult,
} from "./ValidateBlockComponentState-types";

/*
 * Matches a BlockComponent's editorRole, name, content, editState, shouldSelect* and customStorage props against the
 * pattern its component expects. Fails on the first prop that doesn't match.
 */
export const validateBlockComponentState = ({
	blockComponentDraft,
	expectedState,
}: ValidateBlockComponentStateParams): ValidateBlockComponentStateResult => {
	const {
		editorRole,
		name,
		content,
		editState,
		shouldSelectBeforeRemove,
		shouldSelectOnNavigation,
		customStorage,
	} = blockComponentDraft;

	const state: BlockComponentState = {
		editorRole,
		name,
		content,
		editState,
		shouldSelectBeforeRemove,
		shouldSelectOnNavigation,
		customStorage,
	};

	const mismatch = matchJSON({ value: state, pattern: expectedState });

	if (mismatch) {
		return {
			sourceSnapshot: blockComponentDraft,
			failedSnapshot: blockComponentDraft,
			reason: describeJSONMismatch({
				rootDraft: blockComponentDraft,
				nodeDraft: blockComponentDraft,
				value: state,
				mismatch,
			}),
		};
	}

	return null;
};
