import { beamTextRole, contentLineRole } from "rich-text-area";
import type {
	IsScopedEditableEmptyParams,
	IsScopedEditableEmptyResult,
} from "./IsScopedEditableEmpty-types";

/**
 * A ScopedEditable is considered empty when it contains exactly one ContentLine
 * whose only child is a beamText — the engine's structural placeholder that occupies
 * every empty line.
 */
export const isScopedEditableEmpty = ({
	scopedEditable,
}: IsScopedEditableEmptyParams): IsScopedEditableEmptyResult => {
	if (scopedEditable.$$childNodes.length > 1) {
		return false;
	}

	const firstLine = scopedEditable.$$firstChild;

	if (!firstLine) {
		throw new Error("FirstLine can't be null.");
	}

	if (firstLine.$$editorRole !== contentLineRole) {
		return false;
	}

	return firstLine.$$firstChild?.$$editorRole === beamTextRole;
};
