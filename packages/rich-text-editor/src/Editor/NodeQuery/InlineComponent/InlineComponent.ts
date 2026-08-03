import { inlineComponentName, isEditorElement } from "rich-text-area";
import type {
	GetClosestInlineComponentParams,
	GetClosestInlineComponentResult,
} from "./InlineComponent-types";

export const getClosestInlineComponent = ({
	fromNode,
	componentName,
}: GetClosestInlineComponentParams): GetClosestInlineComponentResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === inlineComponentName) {
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
