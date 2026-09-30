import { contentLineRole, isEditorElement } from "rich-text-area";
import type {
	GetClosestContentLineParams,
	GetClosestContentLineResult,
} from "./ContentLine-types";

export const getClosestContentLine = ({
	fromNode,
	display,
}: GetClosestContentLineParams): GetClosestContentLineResult => {
	const { $$parentElement } = fromNode;

	let parent = isEditorElement(fromNode) ? fromNode : $$parentElement;

	while (parent) {
		if (parent.$$editorRole === contentLineRole) {
			if (!display) {
				return parent;
			}

			if (parent.$$display === display) {
				return parent;
			}
		}

		parent = parent.$$parentElement;
	}

	return null;
};
