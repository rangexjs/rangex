import { contentLineName, contentLineRoleSelector } from "rich-text-area";
import type { LinkState } from "#adapters";
import type { GetStateFromLinkParams } from "./GetStateFromLink-types";

/**
 * Reads the link's current href, target, and display text from the DOM and returns them as state.
 */
export const getStateFromLink = ({
	editorAPI,
	link,
}: GetStateFromLinkParams) => {
	const anchor = link.$$querySelector("a");

	if (!(anchor instanceof HTMLAnchorElement)) {
		throw new Error("Anchor's type is invalid.");
	}

	const contentLine = anchor.$$querySelector(contentLineRoleSelector);

	if (contentLine?.$$editorRole !== contentLineName) {
		throw new Error("ContentLine's type is invalid.");
	}

	const { href, target } = anchor;

	const isNewTab = target === "_blank";

	const plainText = editorAPI.getPlainText({
		fromNode: contentLine,
		fromOffset: 0,
		toNode: contentLine,
		toOffset: contentLine.$$childNodes.length,
	});

	const state: LinkState = {
		displayText: { inputValue: plainText, disabled: false },
		url: { inputValue: href },
		toggleButtons: { isNewTab },
	};

	return state;
};
