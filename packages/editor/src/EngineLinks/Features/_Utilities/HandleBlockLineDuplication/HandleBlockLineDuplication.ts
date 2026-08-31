import type {
	HandleBlockLineDuplicationParams,
	HandleBlockLineDuplicationResult,
} from "./HandleBlockLineDuplication-types";

export const handleBlockLineDuplication = ({
	port: editorPort,
	editorAPI,
	getBlockLine,
}: HandleBlockLineDuplicationParams): HandleBlockLineDuplicationResult => {
	const selection = editorAPI.getEditorSelection();
	const snapshotTimeline = editorAPI.getSnapshotTimeline();

	const unsubscribe = editorPort.onDuplicate(() => {
		const blockLine = getBlockLine();

		if (!blockLine) {
			return;
		}

		const { clonedLines } = editorAPI.cloneNodesInRange({
			fromNode: blockLine,
			fromOffset: 0,
			toNode: blockLine,
			toOffset: blockLine.$$childNodes.length,
		});

		const clonedLine = clonedLines.at(0);

		if (!clonedLine) {
			console.warn("Line couldn't be duplicated.");
			return;
		}

		blockLine.$$after(clonedLine);

		selection.setBoundaryPoints({
			fromNode: clonedLine,
			fromOffset: clonedLine.$$childNodes.length,
			toNode: clonedLine,
			toOffset: clonedLine.$$childNodes.length,
		});

		snapshotTimeline.registerSnapshotBoundary();

		editorAPI.focus();
	});

	return () => {
		unsubscribe();
	};
};
