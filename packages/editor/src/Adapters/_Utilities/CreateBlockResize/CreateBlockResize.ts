import { createEmitter } from "../CreateEmitter";
import type {
	BlockResize,
	CreateBlockResizeParams,
	CreateBlockResizeResult,
	HandleParams,
	ResizeEndFn,
	ResizeMoveFn,
} from "./CreateBlockResize-types";

const createHandle = ({
	side,
	xPos,
	resizeMoveEmitter,
	resizeEndEmitter,
}: HandleParams) => {
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

		resizeMoveEmitter.emit({ deltaPx, side });
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (!handle.hasPointerCapture(event.pointerId)) {
			return;
		}

		handle.releasePointerCapture(event.pointerId);
		resizeEndEmitter.emit();
	};

	const onPointerCancel = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (handle.hasPointerCapture(event.pointerId)) {
			handle.releasePointerCapture(event.pointerId);
		}

		resizeEndEmitter.emit();
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
	const resizeMoveEmitter = createEmitter<ResizeMoveFn>();
	const resizeEndEmitter = createEmitter<ResizeEndFn>();

	const container = document.createElement("div");
	container.classList.add("block-resizer");

	const leftHandle = createHandle({
		side: "left",
		xPos,
		resizeMoveEmitter,
		resizeEndEmitter,
	});
	const rightHandle = createHandle({
		side: "right",
		xPos,
		resizeMoveEmitter,
		resizeEndEmitter,
	});

	container.append(leftHandle, rightHandle);

	floatingContainer.append(container);

	const blockResize: BlockResize = {
		get element() {
			return container;
		},

		onResizeMove: (callback) => {
			return resizeMoveEmitter.subscribe(callback);
		},

		onResizeEnd: (callback) => {
			return resizeEndEmitter.subscribe(callback);
		},
	};

	return blockResize;
};
