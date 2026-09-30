import { isEditorElement, nestedEditableRole } from "@rangex/core";
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
		if (parent.$$editorRole === nestedEditableRole) {
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
