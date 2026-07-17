import { type EditorNode, isScopedEditable } from "rich-text-area";
import type {
	CanInsertBlockLinesParams,
	CanInsertBlockLinesResult,
} from "./CanInsertBlockLines-types";

/**
 * Returns true if a block-level component can be inserted at the given node's position.
 */
export const canInsertBlockLines = ({
	fromNode,
	allowedComponents,
}: CanInsertBlockLinesParams): CanInsertBlockLinesResult => {
	let current: EditorNode | null = fromNode;

	while (current) {
		if (isScopedEditable(current) && current.$$display === "block multi-line") {
			const { $$allowedComponents } = current;

			if ($$allowedComponents === null) {
				return true;
			}

			const isAllowed = allowedComponents.every((componentName) =>
				$$allowedComponents.includes(componentName),
			);

			return isAllowed;
		}

		current = current.$$parentElement;
	}

	return false;
};
