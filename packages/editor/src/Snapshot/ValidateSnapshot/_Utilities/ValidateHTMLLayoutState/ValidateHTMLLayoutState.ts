import { matchJSON } from "#utilities";
import { describeJSONMismatch } from "../Utilities";
import type {
	HTMLLayoutState,
	ValidateHTMLLayoutStateParams,
	ValidateHTMLLayoutStateResult,
} from "./ValidateHTMLLayoutState-types";

/*
 * Matches an HTMLLayout's editorRole, localName and customStorage props against the pattern its component expects.
 * Fails on the first prop that doesn't match.
 */
export const validateHTMLLayoutState = ({
	componentDraft,
	htmlLayoutDraft,
	expectedState,
}: ValidateHTMLLayoutStateParams): ValidateHTMLLayoutStateResult => {
	const { editorRole, localName, customStorage } = htmlLayoutDraft;

	const state: HTMLLayoutState = { editorRole, localName, customStorage };

	const mismatch = matchJSON({ value: state, pattern: expectedState });

	if (mismatch) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: describeJSONMismatch({
				rootDraft: componentDraft,
				nodeDraft: htmlLayoutDraft,
				value: state,
				mismatch,
			}),
		};
	}

	return null;
};
