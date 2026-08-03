import {
	blockNestedContextLineName,
	blockNestedContextName,
	blockNestedContextRoleSelector,
} from "rich-text-area";
import { handleComponentUnwrap } from "../../_Utilities";
import type { HandleLineUnwrapParams } from "./HandleLineUnwrap-types";

/**
 * Turns the current line's `BlockNestedContext` "into Text" — unwraps its component, leaving
 * its content as a plain `ContentLine`. A no-op when the current line isn't a
 * `BlockNestedContextLine` at all.
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

			if (currentLine?.$$editorRole !== blockNestedContextLineName) {
				return null;
			}

			const blockNestedContext = currentLine.$$querySelector(
				blockNestedContextRoleSelector,
			);

			if (blockNestedContext?.$$editorRole !== blockNestedContextName) {
				return null;
			}

			return blockNestedContext;
		},
	});
};
