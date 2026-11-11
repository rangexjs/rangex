import type { LinkDisplayText } from "@rangex/editor/link";
import { assertNever } from "#utilities";
import type { GetDisplayTextFieldResult } from "./GetDisplayTextField-types";

/*
 * Maps the link's display text state to the display text field: empty for an insert, the
 * current text for a single wrap or an edit, disabled when the selection wraps into several
 * links.
 */
export const getDisplayTextField = (
	displayText: LinkDisplayText,
): GetDisplayTextFieldResult => {
	if (!displayText) {
		console.warn("getDisplayTextField: selection can't take a link.");
		return { value: "", disabled: false, placeholder: "Example" };
	}

	if (displayText.type === "insert") {
		return { value: "", disabled: false, placeholder: "Example" };
	}

	if (displayText.type === "single-wrap" || displayText.type === "edit") {
		return {
			value: displayText.value,
			disabled: false,
			placeholder: "Example",
		};
	}

	if (displayText.type === "multiple-wrap") {
		return { value: "", disabled: true, placeholder: "Selected text" };
	}

	return assertNever(displayText);
};
