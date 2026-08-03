import {
	blockComponentLineName,
	blockComponentName,
	blockComponentRoleSelector,
} from "rich-text-area";
import { handleComponentUnwrap } from "../../_Utilities";
import type { HandleLineUnwrapParams } from "./HandleLineUnwrap-types";

/**
 * Turns the current line's `BlockComponent` "into Text" — unwraps its component, leaving
 * its content as a plain `ContentLine`. A no-op when the current line isn't a
 * `BlockComponentLine` at all.
 */
export const handleLineUnwrap = ({
	editorPort,
	editorAPI,
	getCurrentLine,
}: HandleLineUnwrapParams) => {
	return handleComponentUnwrap({
		port: editorPort,
		editorAPI,
		getComponent: () => {
			const currentLine = getCurrentLine();

			if (currentLine?.$$editorRole !== blockComponentLineName) {
				return null;
			}

			const blockComponent = currentLine.$$querySelector(
				blockComponentRoleSelector,
			);

			if (blockComponent?.$$editorRole !== blockComponentName) {
				return null;
			}

			return blockComponent;
		},
	});
};
