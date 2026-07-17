import { assertNever } from "../../ErrorHandling";
import type {
	EmbedAspectRatioValue,
	EmbedAttrChange,
	EmbedBlockAlignValue,
	EmbedCaptionPosition,
	EmbedCaptionState,
	EmbedEditListenerOption,
	EmbedEditPopover,
	EmbedEditUpdateListenerParams,
	OnEmbedAlignChangeFn,
	OnEmbedAttrChangeFn,
	OnEmbedCaptionEnabledChangeFn,
	OnEmbedCaptionPositionChangeFn,
	OnEmbedDeleteFn,
	OnEmbedSwapPopoverOpenFn,
	UpdateEmbedAlignFn,
	UpdateEmbedAspectRatioFn,
	UpdateEmbedCaptionFn,
	UpdateEmbedEditPopoverStateParams,
	UpdateEmbedTitleFn,
} from "./EmbedEditPopoverController-types";

export class EmbedEditPopoverController {
	#popover: HTMLDivElement | null = null;
	#align: EmbedBlockAlignValue = "center";
	#aspectRatio: EmbedAspectRatioValue = "16-9";
	#caption: EmbedCaptionState = { enabled: false, position: "below" };
	#title = "";

	#alignListeners: Set<UpdateEmbedAlignFn> = new Set();
	#aspectRatioListeners: Set<UpdateEmbedAspectRatioFn> = new Set();
	#captionListeners: Set<UpdateEmbedCaptionFn> = new Set();
	#titleListeners: Set<UpdateEmbedTitleFn> = new Set();

	#onAlignChangeListeners: Set<OnEmbedAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnEmbedCaptionEnabledChangeFn> =
		new Set();
	#onCaptionPositionChangeListeners: Set<OnEmbedCaptionPositionChangeFn> =
		new Set();
	#onEmbedAttrChangeListeners: Set<OnEmbedAttrChangeFn> = new Set();
	#onDeleteListeners: Set<OnEmbedDeleteFn> = new Set();
	#onSwapPopoverOpenListeners: Set<OnEmbedSwapPopoverOpenFn> = new Set();

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

		assertNever(type);
	}

	subscribe(params: EmbedEditListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: EmbedEditListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitAlignChange(align: EmbedBlockAlignValue) {
		for (const listener of this.#onAlignChangeListeners) {
			listener(align);
		}
	}

	emitCaptionEnabledChange(enabled: boolean) {
		for (const listener of this.#onCaptionEnabledChangeListeners) {
			listener(enabled);
		}
	}

	emitCaptionPositionChange(position: EmbedCaptionPosition) {
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

	emitSwapPopoverOpen() {
		for (const listener of this.#onSwapPopoverOpenListeners) {
			listener();
		}
	}

	updateState({
		align,
		aspectRatio,
		caption,
		title,
	}: UpdateEmbedEditPopoverStateParams) {
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
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): EmbedEditPopover {
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

			onEmbedAttrChange: (callback) => {
				this.#onEmbedAttrChangeListeners.add(callback);
				return () => this.#onEmbedAttrChangeListeners.delete(callback);
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
