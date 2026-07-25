import { BlockResizeHandle } from "#ui-extensions";
import { createOverlayMount } from "../OverlayMount";
import type {
	CreateBlockResizeParams,
	CreateBlockResizeResult,
	EditorBlockResize,
	OnHandleXUpdateFn,
	OnResizeEndFn,
	OnResizeMoveFn,
	UIBlockResize,
} from "./CreateBlockResize-types";

/**
 * Composes `createOverlayMount` with a hardwired resize-handle component, plus the
 * `handleX` position and drag `onResizeMove`/`onResizeEnd` events every media adapter's own
 * resize-appearance handler drives. Each adapter that owns a resizable block builds one of
 * these and assigns it to a named `blockResize` field, same convention as `popover`.
 */
export const createBlockResize = ({
	overlayHost,
}: CreateBlockResizeParams): CreateBlockResizeResult => {
	let handleX = 0;

	const handleXListeners: Set<OnHandleXUpdateFn> = new Set();
	const onResizeMoveListeners: Set<OnResizeMoveFn> = new Set();
	const onResizeEndListeners: Set<OnResizeEndFn> = new Set();

	const uiBlockResize: UIBlockResize = {
		setElement: (element) => {
			overlayMount.uiOverlayMount.setElement(element);
		},

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

	const editorBlockResize: EditorBlockResize = {
		get element() {
			return overlayMount.editorOverlayMount.element;
		},

		get isMounted() {
			return overlayMount.editorOverlayMount.isMounted;
		},

		mount: () => overlayMount.editorOverlayMount.mount(),

		unmount: () => overlayMount.editorOverlayMount.unmount(),

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
