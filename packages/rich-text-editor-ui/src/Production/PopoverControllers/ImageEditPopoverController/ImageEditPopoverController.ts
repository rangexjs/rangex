import { assertNever } from "../../ErrorHandling";
import type {
	BlockAlignValue,
	ImageAspectRatioValue,
	ImageAttrChange,
	ImageCaptionPosition,
	ImageCaptionState,
	ImageEditListenerOption,
	ImageEditPopover,
	ImageEditUpdateListenerParams,
	ImageObjectFitValue,
	OnAlignChangeFn,
	OnCaptionEnabledChangeFn,
	OnCaptionPositionChangeFn,
	OnDeleteFn,
	OnImageAttrChangeFn,
	OnSwapPopoverOpenFn,
	UpdateAlignFn,
	UpdateAltTextFn,
	UpdateAspectRatioFn,
	UpdateCaptionFn,
	UpdateImageEditPopoverStateParams,
	UpdateObjectFitFn,
} from "./ImageEditPopoverController-types";

export class ImageEditPopoverController {
	#popover: HTMLDivElement | null = null;
	#align: BlockAlignValue = "center";
	#objectFit: ImageObjectFitValue = "cover";
	#aspectRatio: ImageAspectRatioValue = "auto";
	#caption: ImageCaptionState = { enabled: false, position: "below" };
	#altText = "";

	#alignListeners: Set<UpdateAlignFn> = new Set();
	#objectFitListeners: Set<UpdateObjectFitFn> = new Set();
	#aspectRatioListeners: Set<UpdateAspectRatioFn> = new Set();
	#captionListeners: Set<UpdateCaptionFn> = new Set();
	#altTextListeners: Set<UpdateAltTextFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onImageAttrChangeListeners: Set<OnImageAttrChangeFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();
	#onSwapPopoverOpenListeners: Set<OnSwapPopoverOpenFn> = new Set();

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

	emitCaptionPositionChange(position: ImageCaptionPosition) {
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

	emitSwapPopoverOpen() {
		for (const listener of this.#onSwapPopoverOpenListeners) {
			listener();
		}
	}

	updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		altText,
	}: UpdateImageEditPopoverStateParams) {
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
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): ImageEditPopover {
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

			onSwapPopoverOpen: (callback) => {
				this.#onSwapPopoverOpenListeners.add(callback);
				return () => this.#onSwapPopoverOpenListeners.delete(callback);
			},
		};
	}
}
