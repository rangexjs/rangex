import type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
	EmbedAspectRatioValue,
	EmbedAttrChange,
	EmbedEmitSwapParams,
	EmbedPort,
	EmbedSwapCheckState,
	OnAlignChangeFn,
	OnCaptionEnabledChangeFn,
	OnCaptionPositionChangeFn,
	OnDeleteFn,
	OnEmbedAttrChangeFn,
	OnEmbedSwapFn,
	UpdateEmbedPopoverStateParams,
} from "#ports";
import { assertNever } from "../../ErrorHandling";
import type {
	EmbedEditListenerOption,
	EmbedEditUpdateListenerParams,
	UpdateEmbedAlignFn,
	UpdateEmbedAspectRatioFn,
	UpdateEmbedCaptionFn,
	UpdateEmbedSwapCheckStateFn,
	UpdateEmbedTitleFn,
} from "./EmbedPopoverController-types";

export class EmbedPopoverController {
	#popover: HTMLDivElement | null = null;
	#swapPopover: HTMLDivElement | null = null;
	#align: BlockAlignValue = "center";
	#aspectRatio: EmbedAspectRatioValue = "16-9";
	#caption: CaptionState = { enabled: false, position: "below" };
	#title = "";
	#swapCheckState: EmbedSwapCheckState = { status: "idle" };

	#alignListeners: Set<UpdateEmbedAlignFn> = new Set();
	#aspectRatioListeners: Set<UpdateEmbedAspectRatioFn> = new Set();
	#captionListeners: Set<UpdateEmbedCaptionFn> = new Set();
	#titleListeners: Set<UpdateEmbedTitleFn> = new Set();
	#swapCheckStateListeners: Set<UpdateEmbedSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onEmbedAttrChangeListeners: Set<OnEmbedAttrChangeFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();
	#onSwapListeners: Set<OnEmbedSwapFn> = new Set();

	get align() {
		return this.#align;
	}

	get aspectRatio() {
		return this.#aspectRatio;
	}

	get caption() {
		return this.#caption;
	}

	get title() {
		return this.#title;
	}

	#updateListener({
		type,
		callback,
		operation,
	}: EmbedEditUpdateListenerParams) {
		if (type === "align") {
			this.#alignListeners[operation](callback);
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

		if (type === "title") {
			this.#titleListeners[operation](callback);
			return;
		}

		if (type === "swapCheckState") {
			this.#swapCheckStateListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: EmbedEditListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: EmbedEditListenerOption) {
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

	emitEmbedAttrChange(params: EmbedAttrChange) {
		for (const listener of this.#onEmbedAttrChangeListeners) {
			listener(params);
		}
	}

	emitDelete() {
		for (const listener of this.#onDeleteListeners) {
			listener();
		}
	}

	emitSwap(params: EmbedEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateState({
		align,
		aspectRatio,
		caption,
		title,
		swapCheckState,
	}: UpdateEmbedPopoverStateParams) {
		if (align) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
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

		if (title !== undefined) {
			this.#title = title;

			for (const listener of this.#titleListeners) {
				listener(this.#title);
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

	get publicAPI(): EmbedPort {
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

			onEmbedAttrChange: (callback) => {
				this.#onEmbedAttrChangeListeners.add(callback);
				return () => this.#onEmbedAttrChangeListeners.delete(callback);
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
