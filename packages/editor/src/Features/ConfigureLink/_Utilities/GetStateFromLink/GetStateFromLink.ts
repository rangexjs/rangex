import {
	contentLineName,
	contentLineRoleSelector,
	nestedEditableRoleSelector,
} from "rich-text-area";
import type {
	GetStateFromLinkParams,
	GetStateFromLinkResult,
} from "./GetStateFromLink-types";

/**
 * Reads a link's live DOM to rebuild its popover state — used both when clicking an existing
 * link (to populate the preview) and right after insertion (to sync the popover to what was
 * actually persisted).
 */
export const getStateFromLink = ({
	editorAPI,
	link,
}: GetStateFromLinkParams): GetStateFromLinkResult => {
	const anchorElement = link.$$querySelector("a");

	if (!(anchorElement instanceof HTMLAnchorElement)) {
		throw new Error("Link is missing its anchor element.");
	}

	const nestedEditable = link.$$querySelector(nestedEditableRoleSelector);

	if (!nestedEditable) {
		throw new Error("Link is missing its NestedEditable.");
	}

	const contentLine = nestedEditable.$$querySelector(contentLineRoleSelector);

	if (contentLine?.$$editorRole !== contentLineName) {
		throw new Error("Link is missing its ContentLine.");
	}

	const plainText = editorAPI.getPlainText({
		fromNode: contentLine,
		fromOffset: 0,
		toNode: contentLine,
		toOffset: contentLine.$$childNodes.length,
	});

	return {
		displayText: { inputValue: plainText, disabled: false },
		url: { inputValue: anchorElement.href },
		toggleButtons: { isNewTab: anchorElement.target === "_blank" },
	};
};
