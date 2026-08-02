import { blockNestedContextLineName } from "rich-text-area";
import { componentsName } from "#ports";
import { createBlockQuote, createCodeBlock } from "../../_Utilities";
import type {
	CreateBlockComponentParams,
	CreateBlockComponentResult,
	HandleTurnIntoParams,
} from "./HandleTurnInto-types";

const createBlockComponent = ({
	name,
	childNodes,
}: CreateBlockComponentParams): CreateBlockComponentResult => {
	const blockComponent = {
		[componentsName.blockQuote]: () => createBlockQuote({ childNodes }),
		[componentsName.codeBlock]: () =>
			createCodeBlock({ language: "typescript", childNodes }),
	}[name]();

	return blockComponent;
};

export const handleTurnInto = ({
	editorPort,
	editorAPI,
	getCurrentLine,
}: HandleTurnIntoParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorPort.onTurnInto((turnIntoName) => {
		const currentLine = getCurrentLine();

		if (currentLine?.$$editorRole !== blockNestedContextLineName) {
			return;
		}

		editorAPI.replaceNestedContextTop(currentLine, (extractedLines) => {
			const blockComponent = createBlockComponent({
				name: turnIntoName,
				childNodes: extractedLines,
			});

			return blockComponent;
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
