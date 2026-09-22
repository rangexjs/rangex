import { componentsName, getClosestBlockComponent } from "#engine-links";
import type { GetCaretMenuQueryFn } from "../../../_Utilities";
import type { CanInsertCommandMenuParams } from "./GetCommandMenuQuery-types";

/*
 * Returns false if the cursor is inside a code block, where slash commands stay literal text.
 */
export const canInsertCommandMenu = ({
	fromText,
}: CanInsertCommandMenuParams): boolean => {
	const blockComponent = getClosestBlockComponent({
		fromNode: fromText,
		components: [componentsName.codeBlock],
	});

	return !blockComponent;
};

/*
 * Scans backward from the cursor for a /-triggered command query. Only matches when the / is at
 * the start of the line or preceded by a space — mid-word slashes stay literal text. Returns null
 * if the cursor is inside a code block, or no valid trigger is found within the scan limit.
 */
export const getCommandMenuQuery: GetCaretMenuQueryFn = ({
	editorAPI,
	fromText,
	fromOffset,
}) => {
	if (!canInsertCommandMenu({ fromText })) {
		return null;
	}

	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
		direction: "backward",
	});

	const charLimit = 50;

	let i = 0;
	let step = plainTextScanner.next();

	while (!step.done) {
		if (i++ >= charLimit) {
			return null;
		}

		const { data, toText, toOffset } = step.value;

		if (data.startsWith("/")) {
			const nextStep = plainTextScanner.next();

			const precededByLineStart = nextStep.done;
			const precededBySpace =
				!nextStep.done && nextStep.value.data.startsWith(" ");

			if (!(precededByLineStart || precededBySpace)) {
				return null;
			}

			return { toText, toOffset, query: data.slice(1) };
		}

		step = plainTextScanner.next();
	}

	return null;
};
