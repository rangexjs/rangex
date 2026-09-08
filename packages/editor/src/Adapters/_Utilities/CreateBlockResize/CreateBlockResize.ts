import type {
	BlockResize,
	CreateBlockResizeParams,
	CreateBlockResizeResult,
	HandleParams,
	ResizeEndFn,
	ResizeMoveFn,
	ResizeMoveParams,
} from "./CreateBlockResize-types";

const createHandle = ({ side, xPos, resizeMove, resizeEnd }: HandleParams) => {
	const handle = document.createElement("span");
	handle.style[side] = `${xPos}px`;

	const onPointerDown = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		handle.setPointerCapture(event.pointerId);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (!handle.hasPointerCapture(event.pointerId)) {
			return;
		}

		const handleRect = handle.getBoundingClientRect();
		const cornerX = handleRect.left + handleRect.width / 2;
		const rawDeltaPx = event.clientX - cornerX;

		const deltaSign = { left: -1, right: 1 }[side];
		const deltaPx = deltaSign * rawDeltaPx;

		resizeMove({ deltaPx, side });
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (!handle.hasPointerCapture(event.pointerId)) {
			return;
		}

		handle.releasePointerCapture(event.pointerId);
		resizeEnd();
	};

	const onPointerCancel = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (handle.hasPointerCapture(event.pointerId)) {
			handle.releasePointerCapture(event.pointerId);
		}

		resizeEnd();
	};

	handle.addEventListener("pointerdown", onPointerDown);
	handle.addEventListener("pointermove", onPointerMove);
	handle.addEventListener("pointerup", onPointerUp);
	handle.addEventListener("pointercancel", onPointerCancel);

	return handle;
};

export const createBlockResize = ({
	floatingContainer,
	xPos,
}: CreateBlockResizeParams): CreateBlockResizeResult => {
	const onResizeMoveListeners: Set<ResizeMoveFn> = new Set();
	const onResizeEndListeners: Set<ResizeEndFn> = new Set();

	const resizeMove = (params: ResizeMoveParams) => {
		for (const listener of onResizeMoveListeners) {
			listener(params);
		}
	};

	const resizeEnd = () => {
		for (const listener of onResizeEndListeners) {
			listener();
		}
	};

	const container = document.createElement("div");
	container.classList.add("block-resizer");

	const leftHandle = createHandle({
		side: "left",
		xPos,
		resizeMove,
		resizeEnd,
	});
	const rightHandle = createHandle({
		side: "right",
		xPos,
		resizeMove,
		resizeEnd,
	});

	container.append(leftHandle, rightHandle);

	floatingContainer.append(container);

	const blockResize: BlockResize = {
		get element() {
			return container;
		},

		onResizeMove: (callback) => {
			onResizeMoveListeners.add(callback);
			return () => onResizeMoveListeners.delete(callback);
		},

		onResizeEnd: (callback) => {
			onResizeEndListeners.add(callback);
			return () => onResizeEndListeners.delete(callback);
		},
	};

	return blockResize;
};
