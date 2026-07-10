import { assertNever } from "../../ErrorHandling";
import type {
	BlockAlignValue,
	ImageListenerOption,
	ImagePopover,
	ImageUpdateListenerParams,
	OnAlignChangeFn,
	UpdateAlignFn,
	UpdateImagePopoverStateParams,
} from "./ImagePopoverController-types";

export class ImagePopoverController {
	#popover: HTMLDivElement | null = null;
	#align: BlockAlignValue = "center";

	#alignListeners: Set<UpdateAlignFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();

	get align() {
		return this.#align;
	}

	#updateListener({ type, callback, operation }: ImageUpdateListenerParams) {
		if (type === "align") {
			this.#alignListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: ImageListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ImageListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitAlignChange(align: BlockAlignValue) {
		for (const listener of this.#onAlignChangeListeners) {
			listener(align);
		}
	}

	updateState({ align }: UpdateImagePopoverStateParams) {
		if (align) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
			}
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): ImagePopover {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			updateState: (params) => this.updateState(params),

			onAlignChange: (callback) => {
				this.#onAlignChangeListeners.add(callback);
				return () => this.#onAlignChangeListeners.delete(callback);
			},
		};
	}
}
