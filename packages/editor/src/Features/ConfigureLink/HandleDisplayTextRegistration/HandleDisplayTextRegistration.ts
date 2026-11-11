import {
	contentLineRole,
	contentLineRoleSelector,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { assertNever } from "#utilities";
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

	return { type: "edit", value };
};

/*
 * Resolves the display text from the current selection: empty for an insert, the selected
 * text when it wraps into a single link, none when it wraps into several.
 */
const getDisplayTextFromSelection = ({
	editorAPI,
}: GetDisplayTextFromSelectionParams): GetDisplayTextInfoResult => {
	const mode = getLinkPlacementMode({ editorAPI });

	if (!mode) {
		return null;
	}

	if (mode.type === "insert") {
		return { type: "insert" };
	}

	if (mode.type === "wrap") {
		const { segments } = mode;

		if (segments.length > 1) {
			return { type: "multiple-wrap" };
		}

		const [segment] = segments;

		if (!segment) {
			throw new Error("Wrap mode is missing its segment.");
		}

		const { startText, startOffset, endText, endOffset } =
			segment.getBoundaryPoints();

		const value = editorAPI.getPlainText({
			fromNode: startText,
			fromOffset: startOffset,
			toNode: endText,
			toOffset: endOffset,
		});

		return { type: "single-wrap", value };
	}

	return assertNever(mode);
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
