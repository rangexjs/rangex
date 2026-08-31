import {
	blockComponentLineName,
	contentLineName,
	type EditorNode,
} from "rich-text-area";
import type {
	GetClosestBlockLevelLineParams,
	GetClosestBlockLevelLineResult,
} from "./Line-types";

export const getClosestBlockLevelLine = ({
	fromNode,
}: GetClosestBlockLevelLineParams): GetClosestBlockLevelLineResult => {
	let currentNode: EditorNode | null = fromNode;

	while (currentNode) {
		if (currentNode.$$editorRole === contentLineName) {
			const { $$parentElement } = currentNode;

			if (!$$parentElement) {
				return null;
			}

			if ($$parentElement.$$display === "block multi-line") {
				return currentNode;
			}
		}

		if (currentNode.$$editorRole === blockComponentLineName) {
			return currentNode;
		}

		currentNode = currentNode.$$parentElement;
	}

	return null;
};
