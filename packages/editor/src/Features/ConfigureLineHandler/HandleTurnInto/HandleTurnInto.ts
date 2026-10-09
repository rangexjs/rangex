import {
	beamTextRole,
	blockComponentLineRole,
	blockComponentRole,
	blockComponentRoleSelector,
	contentLineRole,
	createBeamText,
	createContentLine,
	listRole,
	listRoleSelector,
	nestedEditableRole,
	nestedEditableRoleSelector,
} from "@rangex/core";
import { type BlockComponentName, componentsName } from "#engine-links";
import { assertNever } from "#utilities";
import {
	createAccordionItem,
	createBlockQuote,
	createCodeBlock,
	createList,
	createTodoList,
	getAccordionItemParts,
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
	ShouldSkipFirstLineParams,
	ShouldSkipFirstLineResult,
	TurnLineIntoParams,
	WrapContentLineParams,
} from "./HandleTurnInto-types";

const getNestedEditableTarget = ({
	blockComponentLine,
}: GetNestedEditableTargetParams): GetNestedEditableTargetResult => {
	const nestedEditable = blockComponentLine.$$querySelector(
		nestedEditableRoleSelector,
	);

	if (nestedEditable?.$$editorRole !== nestedEditableRole) {
		throw new Error("NestedEditable's type is invalid.");
	}

	return nestedEditable;
};

const getListTarget = ({
	blockComponentLine,
}: GetListTargetParams): GetListTargetResult => {
	const list = blockComponentLine.$$querySelector(listRoleSelector);

	if (list?.$$editorRole !== listRole) {
		throw new Error("List's type is invalid.");
	}

	return list;
};

const createBlockComponent = (
	params: CreateBlockComponentParams,
): CreateBlockComponentResult => {
	const { childNodes } = params;

	if (params.name === componentsName.accordionItem) {
		const blockComponentLine = createAccordionItem({
			open: true,
			childNodes,
		});
		const { bodyNestedEditable } = getAccordionItemParts({
			accordionItem: blockComponentLine,
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
	const { blockComponentLine, wrapTarget } =
		createBlockComponent(turnIntoParams);

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
 * Whether the first extracted Line should be dropped instead of carried into the new component.
 * Components with more than one editable layer (e.g. an accordion item's summary above its
 * body) extract that extra layer's Line first; when it's empty, carrying it over would leave a
 * blank leading Line in the new component.
 */
const shouldSkipFirstLine = ({
	componentName,
	extractedLines,
}: ShouldSkipFirstLineParams): ShouldSkipFirstLineResult => {
	const componentsWithSkippableFirstLine: BlockComponentName[] = [
		componentsName.accordionItem,
	];

	const isSkippable = componentsWithSkippableFirstLine.some(
		(name) => name === componentName,
	);

	if (!isSkippable) {
		return false;
	}

	const firstLine = extractedLines.at(0);

	if (firstLine?.$$editorRole !== contentLineRole) {
		return false;
	}

	const isEmpty = firstLine.$$firstChild?.$$editorRole === beamTextRole;

	return isEmpty;
};

/*
 * Extracts every Line inside the BlockComponent and rebuilds them under the newly chosen
 * component. The first Line is dropped when shouldSkipFirstLine says so (e.g. an empty
 * accordion item summary), and a single blank paragraph is used as a fallback if the
 * extraction leaves nothing.
 */
const replaceBlockComponentLine = ({
	editorAPI,
	blockComponentLine,
	turnIntoParams,
}: ReplaceBlockComponentLineParams) => {
	const blockComponent = blockComponentLine.$$querySelector(
		blockComponentRoleSelector,
	);

	if (blockComponent?.$$editorRole !== blockComponentRole) {
		throw new Error("BlockComponent's type is invalid.");
	}

	const { $$name } = blockComponent;

	editorAPI.replaceComponentTop(blockComponentLine, (extractedLines) => {
		const childNodes = [...extractedLines];

		const isFirstLineSkipped = shouldSkipFirstLine({
			componentName: $$name,
			extractedLines,
		});

		if (isFirstLineSkipped) {
			childNodes.shift();
		}

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
	if (line.$$editorRole === contentLineRole) {
		wrapContentLine({
			blockComponentPlacement,
			contentLine: line,
			turnIntoParams,
		});
		return;
	}

	if (line.$$editorRole === blockComponentLineRole) {
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
