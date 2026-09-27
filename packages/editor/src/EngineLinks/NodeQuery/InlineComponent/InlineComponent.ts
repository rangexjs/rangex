import { inlineComponentRole, isEditorElement } from "rich-text-area";
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
		if (parent.$$editorRole === inlineComponentRole) {
			if (!components) {
				return parent;
			}

			const { $$name } = parent;

			if (components.some((name) => name === $$name)) {
				return parent;
			}
		}

		parent = parent.$$parentElement;
	}

	return null;
};
