import { contentLineName, isEditorElement } from "rich-text-area";
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
		if (parent.$$editorRole === contentLineName) {
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
