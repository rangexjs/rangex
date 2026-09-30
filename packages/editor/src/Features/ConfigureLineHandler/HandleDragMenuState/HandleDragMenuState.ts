import {
	blockComponentLineRole,
	blockComponentRole,
	blockComponentRoleSelector,
	contentLineRole,
} from "rich-text-area";
import { type BlockComponentName, componentsName } from "#engine-links";
import { assertNever } from "#utilities";
import type {
	HandleBlockComponentLineParams,
	HandleContentLineParams,
	HandleDragMenuStateParams,
	HandleDragMenuStateResult,
	IsAllowedAtLineParams,
	IsAllowedAtLineResult,
} from "./HandleDragMenuState-types";

/*
 * Whether the ScopedEditable holding line accepts the named component, per its
 * $$allowedComponents.
 */
const isAllowedAtLine = ({
	blockComponentPlacement,
	line,
	name,
}: IsAllowedAtLineParams): IsAllowedAtLineResult => {
	return blockComponentPlacement.canWrap({
		fromNode: line,
		fromOffset: 0,
		toNode: line,
		toOffset: 0,
		scope: "current",
		allowedComponents: [name],
	});
};

const handleContentLine = ({
	configPort,
	blockComponentPlacement,
	contentLine,
}: HandleContentLineParams) => {
	const isVisible = (name: BlockComponentName) =>
		isAllowedAtLine({ blockComponentPlacement, line: contentLine, name });

	const { accordionItem, blockQuote, codeBlock, list, todoList } =
		componentsName;

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
		canUnwrap: false,
	});
};

const handleBlockComponentLine = ({
	configPort,
	blockComponentPlacement,
	blockComponentLine,
}: HandleBlockComponentLineParams) => {
	const blockComponent = blockComponentLine.$$querySelector(
		blockComponentRoleSelector,
	);

	if (blockComponent?.$$editorRole !== blockComponentRole) {
		throw new Error("BlockComponent's type is invalid.");
	}

	const { $$name } = blockComponent;

	const { accordionItem, blockQuote, codeBlock, list, table, todoList } =
		componentsName;

	const turnableComponents: BlockComponentName[] = [
		accordionItem,
		blockQuote,
		codeBlock,
		list,
		todoList,
	];

	const isVisible = (name: BlockComponentName) =>
		$$name !== name &&
		turnableComponents.includes(
			$$name as (typeof turnableComponents)[number],
		) &&
		isAllowedAtLine({
			blockComponentPlacement,
			line: blockComponentLine,
			name,
		});

	const unwrappableComponents: BlockComponentName[] = [
		accordionItem,
		blockQuote,
		codeBlock,
		list,
		table,
		todoList,
	];

	const canUnwrap = unwrappableComponents.some((name) => name === $$name);

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
 * configPort.updateState. A target is only offered when the line's ScopedEditable allows that
 * component; a BlockComponentLine additionally hides its own component, since turning a
 * component into what it already is is a no-op, and offers nothing when its component isn't
 * turnable at all.
 */
export const handleDragMenuState = ({
	configPort,
	blockComponentPlacement,
}: HandleDragMenuStateParams): HandleDragMenuStateResult => {
	return (line) => {
		if (!line) {
			return;
		}

		if (line.$$editorRole === contentLineRole) {
			handleContentLine({
				configPort,
				blockComponentPlacement,
				contentLine: line,
			});
			return;
		}

		if (line.$$editorRole === blockComponentLineRole) {
			handleBlockComponentLine({
				configPort,
				blockComponentPlacement,
				blockComponentLine: line,
			});
			return;
		}

		return assertNever(line);
	};
};
