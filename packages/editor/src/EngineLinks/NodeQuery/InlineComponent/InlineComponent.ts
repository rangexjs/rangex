import { inlineComponentName, isEditorElement } from "rich-text-area";
import type {
	GetClosestInlineComponentParams,
	GetClosestInlineComponentResult,
} from "./InlineComponent-types";

export const getClosestInlineComponent = ({
	fromNode,
	components,
}: GetClosestInlineComponentParams): GetClosestInlineComponentResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === inlineComponentName) {
			if (!components) {
				return parent;
			}

			const { $$componentName } = parent;

			if (components.some((name) => name === $$componentName)) {
				return parent;
			}
		}

		parent = parent.$$parentElement;
	}

	return null;
};
