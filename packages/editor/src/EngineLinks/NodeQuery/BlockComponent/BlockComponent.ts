import { blockComponentName, isEditorElement } from "rich-text-area";
import type {
	GetClosestBlockComponentParams,
	GetClosestBlockComponentResult,
} from "./BlockComponent-types";

export const getClosestBlockComponent = ({
	fromNode,
	components,
}: GetClosestBlockComponentParams): GetClosestBlockComponentResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === blockComponentName) {
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
