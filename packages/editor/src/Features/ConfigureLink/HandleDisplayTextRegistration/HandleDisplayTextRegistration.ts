import {
	contentLineName,
	contentLineRoleSelector,
	nestedEditableRoleSelector,
} from "rich-text-area";
import type {
	GetDisplayTextFromLinkParams,
	GetDisplayTextFromSelectionParams,
	GetDisplayTextInfoResult,
	HandleDisplayTextRegistrationParams,
} from "./HandleDisplayTextRegistration-types";

/**
 * Reads the currently open link's own DOM content — used when a link is already open (click/
 * modify flow), so the field reflects what's actually persisted rather than the raw selection.
 */
const getDisplayTextFromLink = ({
	editorAPI,
	link,
}: GetDisplayTextFromLinkParams): GetDisplayTextInfoResult => {
	const nestedEditable = link.$$querySelector(nestedEditableRoleSelector);

	if (!nestedEditable) {
		throw new Error("Link is missing its NestedEditable.");
	}

	const contentLine = nestedEditable.$$querySelector(contentLineRoleSelector);

	if (contentLine?.$$editorRole !== contentLineName) {
		throw new Error("Link is missing its ContentLine.");
	}

	const value = editorAPI.getPlainText({
		fromNode: contentLine,
		fromOffset: 0,
		toNode: contentLine,
		toOffset: contentLine.$$childNodes.length,
	});

	return { value, disabled: false };
};

/**
 * Pre-fills the display text field from the selection, or disables it when the selection spans
 * more than one wrappable segment (no single plain-text value can represent it) — used when no
 * link is open yet (insert/wrap flow).
 */
const getDisplayTextFromSelection = ({
	editorAPI,
}: GetDisplayTextFromSelectionParams): GetDisplayTextInfoResult => {
	const selection = editorAPI.getEditorSelection();

	const { fromText, fromOffset, toText, toOffset } =
		selection.getBoundaryPoints();

	const segments = editorAPI.getInlineWrappableSegments({
		fromNode: fromText,
		fromOffset,
		toNode: toText,
		toOffset,
	});

	if (segments.length === 1) {
		const value = editorAPI.getPlainText({
			fromNode: fromText,
			fromOffset,
			toNode: toText,
			toOffset,
		});

		return { value, disabled: false };
	}

	return { value: "Selected Text", disabled: true };
};

export const handleDisplayTextRegistration = ({
	configPort,
	editorAPI,
}: HandleDisplayTextRegistrationParams) => {
	configPort.registerDisplayText(() => {
		const { currentComponent } = configPort;

		if (currentComponent) {
			return getDisplayTextFromLink({ editorAPI, link: currentComponent });
		}

		return getDisplayTextFromSelection({ editorAPI });
	});
};
