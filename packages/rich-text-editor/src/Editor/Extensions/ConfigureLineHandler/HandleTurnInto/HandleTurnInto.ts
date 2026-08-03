import { blockComponentLineName } from "rich-text-area";
import { componentsName } from "#ports";
import {
	createAccordionItem,
	createBlockQuote,
	createCodeBlock,
	createList,
	createTodoList,
} from "../../_Utilities";
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
		[componentsName.accordionItem]: () =>
			createAccordionItem({ childNodes }).blockComponentLine,
		[componentsName.blockQuote]: () => createBlockQuote({ childNodes }),
		[componentsName.codeBlock]: () =>
			createCodeBlock({ language: "typescript", childNodes }),
		[componentsName.list]: () =>
			createList({ localName: "ul", lineType: "multi-line", childNodes }),
		[componentsName.todoList]: () => createTodoList({ childNodes }),
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

		if (currentLine?.$$editorRole !== blockComponentLineName) {
			return;
		}

		editorAPI.replaceComponentTop(currentLine, (extractedLines) => {
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
