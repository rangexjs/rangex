import { inlineNestedContextName, isEditorElement } from "rich-text-area";
import type {
	GetClosestInlineNestedContextParams,
	GetClosestInlineNestedContextResult,
} from "./InlineNestedContext-types";

export const getClosestInlineNestedContext = ({
	fromNode,
	componentName,
}: GetClosestInlineNestedContextParams): GetClosestInlineNestedContextResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === inlineNestedContextName) {
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
