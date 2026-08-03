import { blockComponentName, isEditorElement } from "rich-text-area";
import type {
	GetClosestBlockComponentParams,
	GetClosestBlockComponentResult,
} from "./BlockComponent-types";

export const getClosestBlockComponent = ({
	fromNode,
	componentName,
}: GetClosestBlockComponentParams): GetClosestBlockComponentResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === blockComponentName) {
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
