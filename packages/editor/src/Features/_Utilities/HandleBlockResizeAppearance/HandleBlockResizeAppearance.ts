import {
	type BlockComponent,
	blockComponentRole,
	isEditorNode,
} from "@rangex/core";
import { blockWidthAttr } from "#constants";
import { createAnchoredOverlayController } from "#engine-links";
import { getBlockAlign } from "../BlockAlign";
import type { HandleBlockResizeAppearanceParams } from "./HandleBlockResizeAppearance-types";

const MIN_CONTAINER_WIDTH = 300;

interface CalcFlexBasisParams {
	blockComponent: BlockComponent;
	deltaPx: number;
	handleSide: "left" | "right";
	dragStartWidth: number;
}

const calcFlexBasis = ({
	blockComponent,
	deltaPx,
	handleSide,
	dragStartWidth,
}: CalcFlexBasisParams): number => {
	const { $$parentElement } = blockComponent;

	if (!$$parentElement) {
		throw new Error("ParentElement not supposed to be null.");
	}

	const align = getBlockAlign({ blockComponentLine: $$parentElement });

	const isSameCorner =
		(align === "left" && handleSide === "left") ||
		(align === "right" && handleSide === "right");

	if (isSameCorner) {
		const numFlexBasis = dragStartWidth + deltaPx;
		const normalizedFlexBasis = Math.max(MIN_CONTAINER_WIDTH, numFlexBasis);

		return Math.round(normalizedFlexBasis);
	}

	const isOppositeCorner =
		(align === "left" && handleSide === "right") ||
		(align === "right" && handleSide === "left");

	if (isOppositeCorner || align === "center") {
		const rect = blockComponent.getBoundingClientRect();
		const numFlexBasis = rect.width + deltaPx;
		const normalizedFlexBasis = Math.max(MIN_CONTAINER_WIDTH, numFlexBasis);

		return Math.round(normalizedFlexBasis);
	}

	throw new Error("Missing condition");
};

/*
 * Shows and hides a block's resize handles on pointer hover, and drives the actual resize
 * by setting the block's width attribute (its flex basis, see BlockComponentLine.css) as resize move/end events fire.
 * On resize end, a width wider than the block can grow is removed, so it falls back to the full width.
 */
export const handleBlockResizeAppearance = ({
	blockResize,
	editorAPI,
	componentName,
}: HandleBlockResizeAppearanceParams) => {
	let currentBlock: BlockComponent | null = null;
	let dragStartWidth: number | null = null;
	let hideTimeoutId = NaN;

	const anchorController = createAnchoredOverlayController({
		element: blockResize.element,
		options: {
			lightDismiss: false,
			closeOnEscape: false,
		},
	});

	const scheduleHide = () => {
		clearTimeout(hideTimeoutId);
		hideTimeoutId = setTimeout(() => {
			anchorController.hide({});
			currentBlock = null;
		}, 100);
	};

	const cancelHide = () => {
		clearTimeout(hideTimeoutId);
	};

	const controller = new AbortController();
	const { signal } = controller;

	blockResize.element.addEventListener("pointerenter", cancelHide, { signal });
	blockResize.element.addEventListener("pointerleave", scheduleHide, {
		signal,
	});

	const unsubscribePointerEnter = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockComponentRole,
		eventListener: {
			type: "pointerenter",
			listener(event) {
				const { currentTarget } = event;

				if (!(currentTarget && isEditorNode(currentTarget))) {
					throw new Error("CurrentTarget must be an EditorNode.");
				}

				if (currentTarget.$$editorRole !== blockComponentRole) {
					throw new Error("CurrentTarget's type is invalid.");
				}

				if (currentTarget.$$name !== componentName) {
					return;
				}

				cancelHide();

				if (currentBlock === currentTarget) {
					return;
				}

				currentBlock = currentTarget;

				anchorController.show(currentTarget, {
					clear: true,
					position: "absolute",
					"position-area": "center",
					width: "anchor-size(width)",
					height: "anchor-size(height)",
				});
			},
		},
	});

	const unsubscribePointerLeave = editorAPI.registerDOMEvent({
		when: ({ element }) => element.$$editorRole === blockComponentRole,
		eventListener: {
			type: "pointerleave",
			listener: scheduleHide,
		},
	});

	const unsubscribeResizeMove = blockResize.onResizeMove(
		({ deltaPx, side }) => {
			if (!currentBlock) {
				return;
			}

			dragStartWidth ??= currentBlock.getBoundingClientRect().width;

			const flexBasis = calcFlexBasis({
				blockComponent: currentBlock,
				deltaPx,
				handleSide: side,
				dragStartWidth,
			});

			currentBlock.$$setAttribute(blockWidthAttr.name, `${flexBasis}`);
		},
	);

	const unsubscribeResizeEnd = blockResize.onResizeEnd(() => {
		dragStartWidth = null;

		if (!currentBlock?.isConnected) {
			return;
		}

		const blockWidth = currentBlock.getAttribute(blockWidthAttr.name);

		if (blockWidth !== null && Number(blockWidth) > currentBlock.offsetWidth) {
			currentBlock.$$removeAttribute(blockWidthAttr.name);
		}

		const snapshotTimeline = editorAPI.getSnapshotTimeline();

		snapshotTimeline.registerSnapshotBoundary();
	});

	return () => {
		controller.abort();
		unsubscribePointerEnter();
		unsubscribePointerLeave();
		unsubscribeResizeMove();
		unsubscribeResizeEnd();
		clearTimeout(hideTimeoutId);
		anchorController.cleanup();
	};
};
