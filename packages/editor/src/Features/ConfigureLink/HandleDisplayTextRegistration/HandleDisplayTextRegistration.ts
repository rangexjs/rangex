import {
	contentLineRole,
	contentLineRoleSelector,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { getLinkPlacementMode } from "../_Utilities";
import type {
	GetDisplayTextFromLinkParams,
	GetDisplayTextFromSelectionParams,
	GetDisplayTextInfoResult,
	HandleDisplayTextRegistrationParams,
} from "./HandleDisplayTextRegistration-types";

/*
 * Reads the currently open link's own DOM content, so the field reflects what's actually
 * persisted rather than the raw selection.
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

	if (contentLine?.$$editorRole !== contentLineRole) {
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

/*
 * Pre-fills the display text field from the current selection, or disables it when the
 * selection spans more than one wrappable segment, since no single value can represent it.
 */
const getDisplayTextFromSelection = ({
	editorAPI,
}: GetDisplayTextFromSelectionParams): GetDisplayTextInfoResult => {
	const mode = getLinkPlacementMode({ editorAPI });

	if (mode === "insert") {
		return { value: "", disabled: false };
	}

	if (mode === "wrap") {
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
	}

	console.warn("Selection doesn't map to a single display text value.");
	return { value: "", disabled: false };
};

/*
 * Registers the display text provider on the config port, sourcing the value from the
 * currently open link when one exists, or from the current selection otherwise.
 */
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
