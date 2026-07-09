import { blockAlignAttr } from "../../Constants";
import type {
	CalcFlexBasisParams,
	CalcFlexBasisResult,
	GetBlockAlignParams,
	HandleBlockResizeInteractionParams,
} from "./HandleBlockResizeInteraction-types";

const MIN_CONTAINER_WIDTH = 300;

const getBlockAlign = ({ blockNestedContext }: GetBlockAlignParams) => {
	const { $$parentElement } = blockNestedContext;

	if (!$$parentElement) {
		throw new Error("ParentElement not supposed to be null.");
	}

	const value = $$parentElement.getAttribute(blockAlignAttr.name);

	if (value === null) {
		console.warn(
			"BlockNestedContextLine has missing attribute.",
			blockAlignAttr.name,
		);

		return "center";
	}

	const values = Object.values(blockAlignAttr.value);

	// biome-ignore lint/suspicious/noExplicitAny: TS Limitation
	if (!values.includes(value as any)) {
		console.warn("Attribute's value is invalid.");
		return "center";
	}

	return value;
};

const calcFlexBasis = ({
	blockNestedContext,
	deltaPx,
	handleSide,
	dragStartWidth,
}: CalcFlexBasisParams): CalcFlexBasisResult => {
	const align = getBlockAlign({ blockNestedContext });

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
