import { type EditorNode, isScopedEditable } from "@rangex/core";
import type {
	GetClosestCommonScopedEditableParams,
	GetClosestCommonScopedEditableResult,
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

/*
 * Returns the innermost ScopedEditable that contains both nodes, regardless of which one is nested deeper.
 */
export const getClosestCommonScopedEditable = ({
	fromNode,
	toNode,
}: GetClosestCommonScopedEditableParams): GetClosestCommonScopedEditableResult => {
	const fromScopedEditables = new Set<EditorNode>();

	let fromCurrentNode: EditorNode | null = fromNode;

	while (fromCurrentNode) {
		if (isScopedEditable(fromCurrentNode)) {
			fromScopedEditables.add(fromCurrentNode);
		}

		fromCurrentNode = fromCurrentNode.$$parentElement;
	}

	let toCurrentNode: EditorNode | null = toNode;

	while (toCurrentNode) {
		if (
			isScopedEditable(toCurrentNode) &&
			fromScopedEditables.has(toCurrentNode)
		) {
			return toCurrentNode;
		}

		toCurrentNode = toCurrentNode.$$parentElement;
	}

	return null;
};
