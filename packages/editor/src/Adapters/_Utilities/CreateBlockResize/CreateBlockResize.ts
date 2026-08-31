import { BlockResizeHandle } from "#ui-extensions";
import { createOverlayMount } from "../OverlayMount";
import type {
	ConfigBlockResize,
	CreateBlockResizeParams,
	CreateBlockResizeResult,
	OnHandleXUpdateFn,
	OnResizeEndFn,
	OnResizeMoveFn,
	PublicBlockResize,
} from "./CreateBlockResize-types";

/**
 * Composes `createOverlayMount` with a hardwired resize-handle component, plus the
 * `handleX` position and drag `onResizeMove`/`onResizeEnd` events every media adapter's own
 * resize-appearance handler drives. Each adapter that owns a resizable block builds one of
 * these and assigns it to a named `blockResize` field, same convention as `popover`.
 */
export const createBlockResize = ({
	floatingContainer,
}: CreateBlockResizeParams): CreateBlockResizeResult => {
	const container = document.createElement("div");
	const leftHandle = document.createElement("span");
	const rightHandle = document.createElement("span");

	container.append(leftHandle, rightHandle);

	floatingContainer.append(container);

	let handleX = 0;

	const handleXListeners: Set<OnHandleXUpdateFn> = new Set();
	const onResizeMoveListeners: Set<OnResizeMoveFn> = new Set();
	const onResizeEndListeners: Set<OnResizeEndFn> = new Set();

	const uiBlockResize: PublicBlockResize = {
		get handleX() {
			return handleX;
		},

		onHandleXUpdate: (callback) => {
			handleXListeners.add(callback);
			return () => handleXListeners.delete(callback);
		},

		emitResizeMove: (params) => {
			for (const listener of onResizeMoveListeners) {
				listener(params);
			}
		},

		emitResizeEnd: () => {
			for (const listener of onResizeEndListeners) {
				listener();
			}
		},
	};

	const editorBlockResize: ConfigBlockResize = {
		get element() {
			return overlayMount.editorOverlayMount.element;
		},

		updateHandleX: (x) => {
			handleX = x;

			for (const listener of handleXListeners) {
				listener(x);
			}
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

	const overlayMount = createOverlayMount({
		overlayHost,
		component: BlockResizeHandle,
		props: { uiBlockResize },
	});

	return { uiBlockResize, editorBlockResize };
};
