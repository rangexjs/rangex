import { isEditorElement, nestedEditableName } from "rich-text-area";
import type {
	GetClosestNestedEditableParams,
	GetClosestNestedEditableResult,
} from "./NestedEditable-types";

export const getClosestNestedEditable = ({
	fromNode,
	display,
}: GetClosestNestedEditableParams): GetClosestNestedEditableResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === nestedEditableName) {
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
