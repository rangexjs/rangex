import {
	blockComponentLineName,
	blockComponentName,
	blockComponentRoleSelector,
	contentLineName,
} from "rich-text-area";
import { assertNever, type BlockComponentName, componentsName } from "#ports";
import type {
	HandleBlockComponentLineParams,
	HandleContentLineParams,
	HandleDragMenuStateParams,
	HandleDragMenuStateResult,
} from "./HandleDragMenuState-types";

const handleContentLine = ({ editorPort }: HandleContentLineParams) => {
	editorPort.updateState({
		turnInto: {
			[componentsName.accordionItem]: false,
			[componentsName.blockQuote]: false,
			[componentsName.codeBlock]: false,
			[componentsName.list]: false,
			[componentsName.todoList]: false,
		},
		canDelete: true,
		canDuplicate: true,
		canUnwrap: false,
	});
};

const handleBlockComponentLine = ({
	editorPort,
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

	editorPort.updateState({
		turnInto: {
			[accordionItem]: isVisible(accordionItem),
			[blockQuote]: isVisible(blockQuote),
			[codeBlock]: isVisible(codeBlock),
			[list]: isVisible(list),
			[todoList]: isVisible(todoList),
		},
		canDelete: true,
		canDuplicate: true,
		canUnwrap,
	});
};

/**
 * Builds the `onLineChange` callback forwarded into {@link handleLineHover}. Whenever the
 * hovered line changes, recomputes which "Turn Into" targets are valid for it and pushes the
 * result through `editorPort.updateState` — `false` both when there's no `BlockComponent`
 * at all (a plain `ContentLine`, or no line hovered) and when the target matches the line's own
 * current component, since turning a component into what it already is is a no-op.
 */
export const handleDragMenuState = ({
	editorPort,
}: HandleDragMenuStateParams): HandleDragMenuStateResult => {
	return (line) => {
		if (!line) {
			return;
		}

		if (line.$$editorRole === contentLineName) {
			handleContentLine({ editorPort });
			return;
		}

		if (line.$$editorRole === blockComponentLineName) {
			handleBlockComponentLine({
				editorPort,
				blockComponentLine: line,
			});
			return;
		}

		return assertNever(line);
	};
};
