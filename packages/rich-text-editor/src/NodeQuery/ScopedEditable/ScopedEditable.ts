import { type EditorNode, isScopedEditable } from "rich-text-area";
import type {
	GetClosestScopedEditableParams,
	GetClosestScopedEditableResult,
} from "./ScopedEditable-types";

export const getClosestScopedEditable = ({
	fromNode,
	display,
}: GetClosestScopedEditableParams): GetClosestScopedEditableResult => {
	let currentNode: EditorNode | null = fromNode;

	while (currentNode) {
		if (isScopedEditable(currentNode)) {
			if (!display || currentNode.$$display === display) {
				return currentNode;
			}
		}

		currentNode = currentNode.$$parentElement;
	}

	return null;
};
