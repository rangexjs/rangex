import { isEditorElement, rootEditableRole } from "rich-text-area";
import type {
	GetClosestRootEditableParams,
	GetClosestRootEditableResult,
} from "./RootEditable-types";

export const getClosestRootEditable = ({
	fromNode,
	display,
}: GetClosestRootEditableParams): GetClosestRootEditableResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === rootEditableRole) {
			if (!display) {
				return parent;
			}

			if (parent.$$display === display) {
				return parent;
			}
		}

		parent = parent.$$parentElement;
	}

	return null;
};
