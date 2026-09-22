import {
	blockComponentLineName,
	createBeamText,
	createContentLine,
} from "rich-text-area";
import { componentsName } from "#engine-links";
import { assertNever } from "#utilities";
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

const createBlockComponent = (
	params: CreateBlockComponentParams,
): CreateBlockComponentResult => {
	const { childNodes } = params;

	if (params.name === componentsName.accordionItem) {
		const { blockComponentLine } = createAccordionItem({ childNodes });
		return blockComponentLine;
	}

	if (params.name === componentsName.blockQuote) {
		return createBlockQuote({ childNodes });
	}

	if (params.name === componentsName.codeBlock) {
		return createCodeBlock({
			language: params.language,
			theme: params.theme,
			childNodes,
		});
	}

	if (params.name === componentsName.list) {
		return createList({
			localName: params.localName,
			lineType: "multi-line",
			childNodes,
		});
	}

	if (params.name === componentsName.todoList) {
		return createTodoList({ childNodes });
	}

	return assertNever(params);
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

	const unsubscribe = configPort.onTurnInto((turnIntoParams) => {
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
				...turnIntoParams,
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
