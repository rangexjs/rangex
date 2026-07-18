import type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
	ImageAspectRatioValue,
	ImageAttrChange,
	ImageEmitSwapParams,
	ImageObjectFitValue,
	ImagePort,
	ImageSwapCheckState,
	OnAlignChangeFn,
	OnCaptionEnabledChangeFn,
	OnCaptionPositionChangeFn,
	OnDeleteFn,
	OnImageAttrChangeFn,
	OnImageSwapFn,
	UpdateImagePopoverStateParams,
} from "#ports";
import { assertNever } from "../../ErrorHandling";
import type {
	ImageEditListenerOption,
	ImageEditUpdateListenerParams,
	UpdateAlignFn,
	UpdateAltTextFn,
	UpdateAspectRatioFn,
	UpdateCaptionFn,
	UpdateObjectFitFn,
	UpdateSwapCheckStateFn,
} from "./ImagePopoverController-types";

export class ImagePopoverController {
	#popover: HTMLDivElement | null = null;
	#swapPopover: HTMLDivElement | null = null;
	#align: BlockAlignValue = "center";
	#objectFit: ImageObjectFitValue = "cover";
	#aspectRatio: ImageAspectRatioValue = "auto";
	#caption: CaptionState = { enabled: false, position: "below" };
	#altText = "";
	#swapCheckState: ImageSwapCheckState = { status: "idle" };

	#alignListeners: Set<UpdateAlignFn> = new Set();
	#objectFitListeners: Set<UpdateObjectFitFn> = new Set();
	#aspectRatioListeners: Set<UpdateAspectRatioFn> = new Set();
	#captionListeners: Set<UpdateCaptionFn> = new Set();
	#altTextListeners: Set<UpdateAltTextFn> = new Set();
	#swapCheckStateListeners: Set<UpdateSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onImageAttrChangeListeners: Set<OnImageAttrChangeFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();
	#onSwapListeners: Set<OnImageSwapFn> = new Set();

	get align() {
		return this.#align;
	}

	get objectFit() {
		return this.#objectFit;
	}

	get aspectRatio() {
		return this.#aspectRatio;
	}

	get caption() {
		return this.#caption;
	}

	get altText() {
		return this.#altText;
	}

	#updateListener({
		type,
		callback,
		operation,
	}: ImageEditUpdateListenerParams) {
		if (type === "align") {
			this.#alignListeners[operation](callback);
			return;
		}

		if (type === "objectFit") {
			this.#objectFitListeners[operation](callback);
			return;
		}

		if (type === "aspectRatio") {
			this.#aspectRatioListeners[operation](callback);
			return;
		}

		if (type === "caption") {
			this.#captionListeners[operation](callback);
			return;
		}

		if (type === "altText") {
			this.#altTextListeners[operation](callback);
			return;
		}

		if (type === "swapCheckState") {
			this.#swapCheckStateListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: ImageEditListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ImageEditListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitAlignChange(align: BlockAlignValue) {
		for (const listener of this.#onAlignChangeListeners) {
			listener(align);
		}
	}

	emitCaptionEnabledChange(enabled: boolean) {
		for (const listener of this.#onCaptionEnabledChangeListeners) {
			listener(enabled);
		}
	}

	emitCaptionPositionChange(position: CaptionPosition) {
		for (const listener of this.#onCaptionPositionChangeListeners) {
			listener(position);
		}
	}

	emitImageAttrChange(params: ImageAttrChange) {
		for (const listener of this.#onImageAttrChangeListeners) {
			listener(params);
		}
	}

	emitDelete() {
		for (const listener of this.#onDeleteListeners) {
			listener();
		}
	}

	emitSwap(params: ImageEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		altText,
		swapCheckState,
	}: UpdateImagePopoverStateParams) {
		if (align) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
			}
		}

		if (objectFit) {
			this.#objectFit = objectFit;

			for (const listener of this.#objectFitListeners) {
				listener(this.#objectFit);
			}
		}

		if (aspectRatio) {
			this.#aspectRatio = aspectRatio;

			for (const listener of this.#aspectRatioListeners) {
				listener(this.#aspectRatio);
			}
		}

		if (caption) {
			this.#caption = caption;

			for (const listener of this.#captionListeners) {
				listener(this.#caption);
			}
		}

		if (altText !== undefined) {
			this.#altText = altText;

			for (const listener of this.#altTextListeners) {
				listener(this.#altText);
			}
		}

		if (swapCheckState) {
			this.#swapCheckState = swapCheckState;

			for (const listener of this.#swapCheckStateListeners) {
				listener(this.#swapCheckState);
			}
		}
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	setSwapPopover(element: HTMLDivElement) {
		this.#swapPopover = element;
	}

	get publicAPI(): ImagePort {
		const controller = this;

		return {
			get popover() {
				if (!controller.#popover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#popover;
			},

			get swapPopover() {
				if (!controller.#swapPopover) {
					throw new Error("PopoverNode shouldn't be null.");
				}

				return controller.#swapPopover;
			},

			updateState: (params) => this.updateState(params),

			setAlign: (align) => this.updateState({ align }),

			setCaption: (caption) => this.updateState({ caption }),

			onAlignChange: (callback) => {
				this.#onAlignChangeListeners.add(callback);
				return () => this.#onAlignChangeListeners.delete(callback);
			},

			onCaptionEnabledChange: (callback) => {
				this.#onCaptionEnabledChangeListeners.add(callback);
				return () => this.#onCaptionEnabledChangeListeners.delete(callback);
			},

			onCaptionPositionChange: (callback) => {
				this.#onCaptionPositionChangeListeners.add(callback);
				return () => this.#onCaptionPositionChangeListeners.delete(callback);
			},

			onImageAttrChange: (callback) => {
				this.#onImageAttrChangeListeners.add(callback);
				return () => this.#onImageAttrChangeListeners.delete(callback);
			},

			onDelete: (callback) => {
				this.#onDeleteListeners.add(callback);
				return () => this.#onDeleteListeners.delete(callback);
			},

			onSwap: (callback) => {
				this.#onSwapListeners.add(callback);
				return () => this.#onSwapListeners.delete(callback);
			},
		};
	}
}
