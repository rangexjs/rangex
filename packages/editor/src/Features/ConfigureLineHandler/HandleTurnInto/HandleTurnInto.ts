import {
	blockComponentLineName,
	createBeamText,
	createContentLine,
} from "rich-text-area";
import { componentsName } from "#engine-links";
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
			createCodeBlock({ language: null, theme: null, childNodes }),
		[componentsName.list]: () =>
			createList({ localName: "ul", lineType: "multi-line", childNodes }),
		[componentsName.todoList]: () => createTodoList({ childNodes }),
	}[name]();

	return blockComponent;
};

/*
 * Turns the current line's BlockComponent into a different one, keeping its content: extracts
 * every Line inside it and rebuilds them under the newly chosen component, falling back to a
 * single blank paragraph if the extraction leaves nothing. A no-op when the current line isn't
 * a BlockComponentLine at all.
 */
export const handleTurnInto = ({
	configPort,
	editorAPI,
	getCurrentLine,
}: HandleTurnIntoParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = configPort.onTurnInto((turnIntoName) => {
		const currentLine = getCurrentLine();

		if (currentLine?.$$editorRole !== blockComponentLineName) {
			return;
		}

		editorAPI.replaceComponentTop(currentLine, (extractedLines) => {
			const childNodes = [...extractedLines];

			if (!childNodes.length) {
				console.warn("TurnInto target has no Lines.");

				childNodes.push(
					createContentLine({
						localName: "p",
						childNodes: [createBeamText({})],
					}),
				);
			}

			const blockComponent = createBlockComponent({
				name: turnIntoName,
				childNodes,
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
