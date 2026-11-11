import { blockComponentLineRole, contentLineRole, type EditorNode } from "@rangex/core";

import type { GetClosestBlockLevelLineParams, GetClosestBlockLevelLineResult } from "./Line-types";

export const getClosestBlockLevelLine = ({
	fromNode,
}: GetClosestBlockLevelLineParams): GetClosestBlockLevelLineResult => {
	let currentNode: EditorNode | null = fromNode;

	while (currentNode) {
		if (currentNode.$$editorRole === contentLineRole) {
			const { $$parentElement } = currentNode;

			if (!$$parentElement) {
				return null;
			}

			if ($$parentElement.$$display === "block multi-line") {
				return currentNode;
			}
		}

		if (currentNode.$$editorRole === blockComponentLineRole) {
			return currentNode;
		}

		currentNode = currentNode.$$parentElement;
	}

	return null;
};
