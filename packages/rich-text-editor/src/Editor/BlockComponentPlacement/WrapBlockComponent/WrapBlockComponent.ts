import type { WrapBlockComponentParams } from "./WrapBlockComponent-types";

export const wrapBlockComponent = ({
	editorAPI,
	fromNode,
	fromOffset,
	toNode,
	toOffset,
	blockComponentLine,
	target,
}: WrapBlockComponentParams) => {
	const blockWrappableSegment = editorAPI.getBlockWrappableSegment({
		fromNode,
		fromOffset,
		toNode,
		toOffset,
	});

	if (!blockWrappableSegment) {
		throw new Error(
			"RootEditable must be or contain a ScopedEditable with 'block multi-line'.",
		);
	}

	blockWrappableSegment.wrapInto({ blockComponentLine, target });
};
