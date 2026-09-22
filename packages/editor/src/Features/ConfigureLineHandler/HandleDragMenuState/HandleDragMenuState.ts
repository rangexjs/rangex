import {
	blockComponentLineName,
	blockComponentName,
	blockComponentRoleSelector,
	contentLineName,
} from "rich-text-area";
import { type BlockComponentName, componentsName } from "#engine-links";
import { assertNever } from "#utilities";
import type {
	HandleBlockComponentLineParams,
	HandleContentLineParams,
	HandleDragMenuStateParams,
	HandleDragMenuStateResult,
} from "./HandleDragMenuState-types";

const handleContentLine = ({ configPort }: HandleContentLineParams) => {
	configPort.updateState({
		turnIntoAvailability: {
			[componentsName.accordionItem]: false,
			[componentsName.blockQuote]: false,
			[componentsName.codeBlock]: false,
			[componentsName.list]: false,
			[componentsName.todoList]: false,
		},
		canRemove: true,
		canDuplicate: true,
		canUnwrap: false,
	});
};

const handleBlockComponentLine = ({
	configPort,
	blockComponentLine,
}: HandleBlockComponentLineParams) => {
	const blockComponent = blockComponentLine.$$querySelector(
		blockComponentRoleSelector,
	);

	if (blockComponent?.$$editorRole !== blockComponentName) {
		throw new Error("BlockComponent's type is invalid.");
	}

	const { $$componentName } = blockComponent;

	const { accordionItem, blockQuote, codeBlock, list, todoList } =
		componentsName;

	const turnableComponents: BlockComponentName[] = [
		accordionItem,
		blockQuote,
		codeBlock,
		list,
		todoList,
	];

	const isVisible = (name: BlockComponentName) =>
		$$componentName !== name &&
		turnableComponents.includes(
			$$componentName as (typeof turnableComponents)[number],
		);

	const unwrappableComponents: BlockComponentName[] = [
		accordionItem,
		blockQuote,
		codeBlock,
		list,
		todoList,
	];

	const canUnwrap = unwrappableComponents.some(
		(name) => name === $$componentName,
	);

	configPort.updateState({
		turnIntoAvailability: {
			[accordionItem]: isVisible(accordionItem),
			[blockQuote]: isVisible(blockQuote),
			[codeBlock]: isVisible(codeBlock),
			[list]: isVisible(list),
			[todoList]: isVisible(todoList),
		},
		canRemove: true,
		canDuplicate: true,
		canUnwrap,
	});
};

/*
 * Builds the onLineChange callback forwarded into handleLineHover. Whenever the hovered line
 * changes, recomputes which "Turn Into" targets are valid for it and pushes the result through
 * configPort.updateState — false both when there's no BlockComponent at all (a plain
 * ContentLine, or no line hovered) and when the target matches the line's own current
 * component, since turning a component into what it already is is a no-op.
 */
export const handleDragMenuState = ({
	configPort,
}: HandleDragMenuStateParams): HandleDragMenuStateResult => {
	return (line) => {
		if (!line) {
			return;
		}

		if (line.$$editorRole === contentLineName) {
			handleContentLine({ configPort });
			return;
		}

		if (line.$$editorRole === blockComponentLineName) {
			handleBlockComponentLine({
				configPort,
				blockComponentLine: line,
			});
			return;
		}

		return assertNever(line);
	};
};
