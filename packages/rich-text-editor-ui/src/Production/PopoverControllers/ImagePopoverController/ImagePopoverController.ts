import { assertNever } from "../../ErrorHandling";
import type {
	BlockAlignValue,
	EmitSwapParams,
	ImageAspectRatioValue,
	ImageCaptionPosition,
	ImageCaptionState,
	ImageListenerOption,
	ImageObjectFitValue,
	ImagePopover,
	ImageUpdateListenerParams,
	OnAlignChangeFn,
	OnAltTextChangeFn,
	OnAspectRatioChangeFn,
	OnCaptionEnabledChangeFn,
	OnCaptionPositionChangeFn,
	OnDeleteFn,
	OnObjectFitChangeFn,
	OnSwapFn,
	UpdateAlignFn,
	UpdateAltTextFn,
	UpdateAspectRatioFn,
	UpdateCaptionFn,
	UpdateImagePopoverStateParams,
	UpdateObjectFitFn,
} from "./ImagePopoverController-types";

export class ImagePopoverController {
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
	#onObjectFitChangeListeners: Set<OnObjectFitChangeFn> = new Set();
	#onAspectRatioChangeListeners: Set<OnAspectRatioChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onAltTextChangeListeners: Set<OnAltTextChangeFn> = new Set();
	#onSwapListeners: Set<OnSwapFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();

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

	#updateListener({ type, callback, operation }: ImageUpdateListenerParams) {
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

	emitObjectFitChange(objectFit: ImageObjectFitValue) {
		for (const listener of this.#onObjectFitChangeListeners) {
			listener(objectFit);
		}
	}

	emitAspectRatioChange(aspectRatio: ImageAspectRatioValue) {
		for (const listener of this.#onAspectRatioChangeListeners) {
			listener(aspectRatio);
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

	emitAltTextChange(altText: string) {
		for (const listener of this.#onAltTextChangeListeners) {
			listener(altText);
		}
	}

	emitSwap(params: EmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	emitDelete() {
		for (const listener of this.#onDeleteListeners) {
			listener();
		}
	}

	updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		altText,
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

			onObjectFitChange: (callback) => {
				this.#onObjectFitChangeListeners.add(callback);
				return () => this.#onObjectFitChangeListeners.delete(callback);
			},

			onAspectRatioChange: (callback) => {
				this.#onAspectRatioChangeListeners.add(callback);
				return () => this.#onAspectRatioChangeListeners.delete(callback);
			},

			onCaptionEnabledChange: (callback) => {
				this.#onCaptionEnabledChangeListeners.add(callback);
				return () => this.#onCaptionEnabledChangeListeners.delete(callback);
			},

			onCaptionPositionChange: (callback) => {
				this.#onCaptionPositionChangeListeners.add(callback);
				return () => this.#onCaptionPositionChangeListeners.delete(callback);
			},

			onAltTextChange: (callback) => {
				this.#onAltTextChangeListeners.add(callback);
				return () => this.#onAltTextChangeListeners.delete(callback);
			},

			onSwap: (callback) => {
				this.#onSwapListeners.add(callback);
				return () => this.#onSwapListeners.delete(callback);
			},

			onDelete: (callback) => {
				this.#onDeleteListeners.add(callback);
				return () => this.#onDeleteListeners.delete(callback);
			},
		};
	}
}
