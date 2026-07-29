import { componentsName } from "../../../Constants";
import { getClosestBlockNestedContext } from "../../../NodeQuery";
import type {
	CanInsertCommandMenuParams,
	GetCommandMenuQueryParams,
	GetCommandMenuQueryResult,
} from "./Utilities-types";

export const canInsertCommandMenu = ({
	fromText,
}: CanInsertCommandMenuParams) => {
	const blockNestedContext = getClosestBlockNestedContext({
		fromNode: fromText,
		componentName: componentsName.codeBlock,
	});

	const canInsert = !blockNestedContext;

	return canInsert;
};

/**
 * Scans backward from the cursor for a `/`-triggered command query. Only matches when the `/` is
 * at the start of the line or preceded by a space — mid-word slashes stay literal text. Returns
 * null if no valid trigger is found within the char limit.
 */
export const getCommandMenuQuery = ({
	editorAPI,
	fromText,
	fromOffset,
}: GetCommandMenuQueryParams): GetCommandMenuQueryResult => {
	const { plainTextScanner } = editorAPI.createPlainTextScanner({
		fromNode: fromText,
		fromOffset,
		direction: "backward",
	});

	// If the / was not found in the first hundred chars, we stop scanning
	const charLimit = 100;

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
