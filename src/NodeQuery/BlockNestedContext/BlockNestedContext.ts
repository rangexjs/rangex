import { blockNestedContextName, isEditorElement } from "rich-text-area";
import type {
	GetClosestBlockNestedContextParams,
	GetClosestBlockNestedContextResult,
} from "./BlockNestedContext-types";

export const getClosestBlockNestedContext = ({
	fromNode,
	componentName,
}: GetClosestBlockNestedContextParams): GetClosestBlockNestedContextResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === blockNestedContextName) {
			if (!componentName) {
				return parent;
			}

			if (parent.$$componentName === componentName) {
				return parent;
			}
		}

		parent = parent.$$parentElement;
	}

	return null;
};
