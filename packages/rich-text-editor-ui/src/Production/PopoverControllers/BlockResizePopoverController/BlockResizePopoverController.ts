import type {
	BlockResizePopover,
	OnResizeEndFn,
	OnResizeMoveFn,
	OnResizeMoveParams,
	UpdateHandleXFn,
} from "./BlockResizePopoverController-types";

export class BlockResizePopoverController {
	#popover: HTMLDivElement | null = null;
	#handleX = 0;

	#onResizeMoveListeners: Set<OnResizeMoveFn> = new Set();
	#onResizeEndListeners: Set<OnResizeEndFn> = new Set();
	#handleXListeners: Set<UpdateHandleXFn> = new Set();

	get handleX() {
		return this.#handleX;
	}

	emitResizeMove(params: OnResizeMoveParams) {
		for (const listener of this.#onResizeMoveListeners) {
			listener(params);
		}
	}

	emitResizeEnd() {
		for (const listener of this.#onResizeEndListeners) {
			listener();
		}
	}

	subscribe(callback: UpdateHandleXFn) {
		this.#handleXListeners.add(callback);
	}

	unsubscribe(callback: UpdateHandleXFn) {
		this.#handleXListeners.delete(callback);
	}

	updateHandleX(x: number) {
		this.#handleX = x;

		for (const listener of this.#handleXListeners) {
			listener(x);
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): BlockResizePopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			onResizeMove: (callback) => {
				this.#onResizeMoveListeners.add(callback);
				return () => this.#onResizeMoveListeners.delete(callback);
			},

			onResizeEnd: (callback) => {
				this.#onResizeEndListeners.add(callback);
				return () => this.#onResizeEndListeners.delete(callback);
			},

			updateHandleX: (x) => this.updateHandleX(x),
		};
	}
}
