import { getBlockAlign } from "../../Components/_Utilities";
import type {
	CalcFlexBasisParams,
	CalcFlexBasisResult,
	HandleBlockResizeInteractionParams,
} from "./HandleBlockResizeInteraction-types";

const MIN_CONTAINER_WIDTH = 300;

const calcFlexBasis = ({
	blockNestedContext,
	deltaPx,
	handleSide,
	dragStartWidth,
}: CalcFlexBasisParams): CalcFlexBasisResult => {
	const { $$parentElement } = blockNestedContext;

	if (!$$parentElement) {
		throw new Error("ParentElement not supposed to be null.");
	}

	const align = getBlockAlign({ blockNestedContextLine: $$parentElement });

	const isSameCorner =
		(align === "left" && handleSide === "left") ||
		(align === "right" && handleSide === "right");

	if (isSameCorner) {
		const numFlexBasis = dragStartWidth + deltaPx;
		const normalizedFlexBasis = Math.max(MIN_CONTAINER_WIDTH, numFlexBasis);
		const flexBasis = `${normalizedFlexBasis}px`;

		return flexBasis;
	}

	const isOppositeCorner =
		(align === "left" && handleSide === "right") ||
		(align === "right" && handleSide === "left");

	if (isOppositeCorner || align === "center") {
		const rect = blockNestedContext.getBoundingClientRect();
		const numFlexBasis = rect.width + deltaPx;
		const normalizedFlexBasis = Math.max(MIN_CONTAINER_WIDTH, numFlexBasis);
		const flexBasis = `${normalizedFlexBasis}px`;

		return flexBasis;
	}

	throw new Error("Missing condition");
};

export const handleBlockResizeInteraction = ({
	richTextEditorUI,
	editorAPI,
	internals,
}: HandleBlockResizeInteractionParams) => {
	const { blockResizePopover } = richTextEditorUI;

	let dragStartWidth: number | null = null;

	const unsubscribeResizeMove = blockResizePopover.onResizeMove(
		({ deltaPx, side }) => {
			const { currentBlock } = internals;

			if (!currentBlock) {
				return;
			}

			dragStartWidth ??= currentBlock.getBoundingClientRect().width;

			const flexBasis = calcFlexBasis({
				blockNestedContext: currentBlock,
				deltaPx,
				handleSide: side,
				dragStartWidth,
			});

			currentBlock.style.flexBasis = flexBasis;
		},
	);

	const unsubscribeResizeEnd = blockResizePopover.onResizeEnd(() => {
		dragStartWidth = null;

		const { currentBlock } = internals;

		if (!currentBlock?.isConnected) {
			return;
		}

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		unsubscribeResizeMove();
		unsubscribeResizeEnd();
	};
};
