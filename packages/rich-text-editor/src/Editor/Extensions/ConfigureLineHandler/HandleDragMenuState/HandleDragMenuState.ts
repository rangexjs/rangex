import {
	blockNestedContextLineName,
	blockNestedContextName,
	blockNestedContextRoleSelector,
	contentLineName,
} from "rich-text-area";
import { assertNever } from "#ports";
import { componentsName } from "../../../Constants";
import type {
	HandleBlockNestedContextLineParams,
	HandleContentLineParams,
	HandleDragMenuStateParams,
	HandleDragMenuStateResult,
} from "./HandleDragMenuState-types";

const handleContentLine = ({ editorPort }: HandleContentLineParams) => {
	editorPort.updateState({
		turnInto: { blockQuote: false, codeBlock: false },
		canDelete: true,
		canDuplicate: true,
	});
};

const handleBlockNestedContextLine = ({
	editorPort,
	blockNestedContextLine,
}: HandleBlockNestedContextLineParams) => {
	const blockNestedContext = blockNestedContextLine.$$querySelector(
		blockNestedContextRoleSelector,
	);

	if (blockNestedContext?.$$editorRole !== blockNestedContextName) {
		throw new Error("BlockNestedContext's type is invalid.");
	}

	const { $$componentName } = blockNestedContext;

	const blockQuote = $$componentName !== componentsName.blockQuote;
	const codeBlock = $$componentName !== componentsName.codeBlock;

	editorPort.updateState({
		turnInto: { blockQuote, codeBlock },
		canDelete: true,
		canDuplicate: true,
	});
};

/**
 * Builds the `onLineChange` callback forwarded into {@link handleLineHover}. Whenever the
 * hovered line changes, recomputes which "Turn Into" targets are valid for it and pushes the
 * result through `editorPort.updateState` — `false` both when there's no `BlockNestedContext`
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

		if (line.$$editorRole === blockNestedContextLineName) {
			handleBlockNestedContextLine({
				editorPort,
				blockNestedContextLine: line,
			});
			return;
		}

		return assertNever(line);
	};
};
