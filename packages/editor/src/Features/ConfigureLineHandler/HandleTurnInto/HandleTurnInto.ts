import {
	blockComponentLineName,
	contentLineName,
	createBeamText,
	createContentLine,
	listName,
	listRoleSelector,
	nestedEditableName,
	nestedEditableRoleSelector,
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
	GetListTargetParams,
	GetListTargetResult,
	GetNestedEditableTargetParams,
	GetNestedEditableTargetResult,
	HandleTurnIntoParams,
	ReplaceBlockComponentLineParams,
	TurnLineIntoParams,
	WrapContentLineParams,
} from "./HandleTurnInto-types";

const getNestedEditableTarget = ({
	blockComponentLine,
}: GetNestedEditableTargetParams): GetNestedEditableTargetResult => {
	const nestedEditable = blockComponentLine.$$querySelector(
		nestedEditableRoleSelector,
	);

	if (nestedEditable?.$$editorRole !== nestedEditableName) {
		throw new Error("NestedEditable's type is invalid.");
	}

	return nestedEditable;
};

const getListTarget = ({
	blockComponentLine,
}: GetListTargetParams): GetListTargetResult => {
	const list = blockComponentLine.$$querySelector(listRoleSelector);

	if (list?.$$editorRole !== listName) {
		throw new Error("List's type is invalid.");
	}

	return list;
};

const createBlockComponent = (
	params: CreateBlockComponentParams,
): CreateBlockComponentResult => {
	const { childNodes } = params;

	if (params.name === componentsName.accordionItem) {
		const { blockComponentLine, bodyNestedEditable } = createAccordionItem({
			childNodes,
		});

		return { blockComponentLine, wrapTarget: bodyNestedEditable };
	}

	if (params.name === componentsName.blockQuote) {
		const blockComponentLine = createBlockQuote({ childNodes });
		const wrapTarget = getNestedEditableTarget({ blockComponentLine });

		return { blockComponentLine, wrapTarget };
	}

	if (params.name === componentsName.codeBlock) {
		const blockComponentLine = createCodeBlock({
			language: params.language,
			theme: params.theme,
			childNodes,
		});
		const wrapTarget = getListTarget({ blockComponentLine });

		return { blockComponentLine, wrapTarget };
	}

	if (params.name === componentsName.list) {
		const blockComponentLine = createList({
			localName: params.localName,
			lineType: "multi-line",
			childNodes,
		});
		const wrapTarget = getListTarget({ blockComponentLine });

		return { blockComponentLine, wrapTarget };
	}

	if (params.name === componentsName.todoList) {
		const blockComponentLine = createTodoList({ childNodes });
		const wrapTarget = getListTarget({ blockComponentLine });

		return { blockComponentLine, wrapTarget };
	}

	return assertNever(params);
};

/*
 * Wraps a plain ContentLine into the newly chosen component.
 */
const wrapContentLine = ({
	blockComponentPlacement,
	contentLine,
	turnIntoParams,
}: WrapContentLineParams) => {
	const { blockComponentLine, wrapTarget } = createBlockComponent({
		...turnIntoParams,
		childNodes: [],
	});

	blockComponentPlacement.wrap({
		blockComponentLine,
		fromNode: contentLine,
		fromOffset: 0,
		toNode: contentLine,
		toOffset: 0,
		target: wrapTarget,
	});
};

/*
 * Extracts every Line inside the BlockComponent and rebuilds them under the newly chosen
 * component, falling back to a single blank paragraph if the extraction leaves nothing.
 */
const replaceBlockComponentLine = ({
	editorAPI,
	blockComponentLine,
	turnIntoParams,
}: ReplaceBlockComponentLineParams) => {
	editorAPI.replaceComponentTop(blockComponentLine, (extractedLines) => {
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

		const { blockComponentLine: replacementLine } = createBlockComponent({
			...turnIntoParams,
			childNodes,
		});

		return replacementLine;
	});
};

const turnLineInto = ({
	editorAPI,
	blockComponentPlacement,
	line,
	turnIntoParams,
}: TurnLineIntoParams) => {
	if (line.$$editorRole === contentLineName) {
		wrapContentLine({
			blockComponentPlacement,
			contentLine: line,
			turnIntoParams,
		});
		return;
	}

	if (line.$$editorRole === blockComponentLineName) {
		replaceBlockComponentLine({
			editorAPI,
			blockComponentLine: line,
			turnIntoParams,
		});
		return;
	}

	return assertNever(line);
};

/*
 * Turns the current line into the chosen component, keeping its content: a ContentLine is
 * wrapped into it, while a BlockComponentLine has its component replaced by it.
 */
export const handleTurnInto = ({
	configPort,
	editorAPI,
	blockComponentPlacement,
	getCurrentLine,
}: HandleTurnIntoParams) => {
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = configPort.onTurnInto((turnIntoParams) => {
		const currentLine = getCurrentLine();

		if (!currentLine) {
			return;
		}

		turnLineInto({
			editorAPI,
			blockComponentPlacement,
			line: currentLine,
			turnIntoParams,
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
