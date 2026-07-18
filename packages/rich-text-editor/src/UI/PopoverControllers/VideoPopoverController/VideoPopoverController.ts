import type {
	BlockAlignValue,
	CaptionPosition,
	CaptionState,
	OnAlignChangeFn,
	OnCaptionEnabledChangeFn,
	OnCaptionPositionChangeFn,
	OnDeleteFn,
	OnVideoAttrChangeFn,
	OnVideoSwapFn,
	UpdateVideoPopoverStateParams,
	VideoAspectRatioValue,
	VideoAttrChange,
	VideoEmitSwapParams,
	VideoObjectFitValue,
	VideoPort,
	VideoSwapCheckState,
} from "#ports";
import { assertNever } from "../../ErrorHandling";
import type {
	UpdateAutoplayFn,
	UpdateControlsFn,
	UpdateLoopFn,
	UpdateMutedFn,
	UpdatePosterFn,
	UpdateTitleFn,
	UpdateVideoAlignFn,
	UpdateVideoAspectRatioFn,
	UpdateVideoCaptionFn,
	UpdateVideoObjectFitFn,
	UpdateVideoSwapCheckStateFn,
	VideoEditListenerOption,
	VideoEditUpdateListenerParams,
} from "./VideoPopoverController-types";

export class VideoPopoverController {
	#popover: HTMLDivElement | null = null;
	#swapPopover: HTMLDivElement | null = null;
	#align: BlockAlignValue = "center";
	#objectFit: VideoObjectFitValue = "cover";
	#aspectRatio: VideoAspectRatioValue = "auto";
	#caption: CaptionState = { enabled: false, position: "below" };
	#poster = "";
	#title = "";
	#controls = true;
	#autoplay = false;
	#loop = false;
	#muted = false;
	#swapCheckState: VideoSwapCheckState = { status: "idle" };

	#alignListeners: Set<UpdateVideoAlignFn> = new Set();
	#objectFitListeners: Set<UpdateVideoObjectFitFn> = new Set();
	#aspectRatioListeners: Set<UpdateVideoAspectRatioFn> = new Set();
	#captionListeners: Set<UpdateVideoCaptionFn> = new Set();
	#posterListeners: Set<UpdatePosterFn> = new Set();
	#titleListeners: Set<UpdateTitleFn> = new Set();
	#controlsListeners: Set<UpdateControlsFn> = new Set();
	#autoplayListeners: Set<UpdateAutoplayFn> = new Set();
	#loopListeners: Set<UpdateLoopFn> = new Set();
	#mutedListeners: Set<UpdateMutedFn> = new Set();
	#swapCheckStateListeners: Set<UpdateVideoSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onVideoAttrChangeListeners: Set<OnVideoAttrChangeFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();
	#onSwapListeners: Set<OnVideoSwapFn> = new Set();

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

	get poster() {
		return this.#poster;
	}

	get title() {
		return this.#title;
	}

	get controls() {
		return this.#controls;
	}

	get autoplay() {
		return this.#autoplay;
	}

	get loop() {
		return this.#loop;
	}

	get muted() {
		return this.#muted;
	}

	#updateListener({
		type,
		callback,
		operation,
	}: VideoEditUpdateListenerParams) {
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

		if (type === "poster") {
			this.#posterListeners[operation](callback);
			return;
		}

		if (type === "title") {
			this.#titleListeners[operation](callback);
			return;
		}

		if (type === "controls") {
			this.#controlsListeners[operation](callback);
			return;
		}

		if (type === "autoplay") {
			this.#autoplayListeners[operation](callback);
			return;
		}

		if (type === "loop") {
			this.#loopListeners[operation](callback);
			return;
		}

		if (type === "muted") {
			this.#mutedListeners[operation](callback);
			return;
		}

		if (type === "swapCheckState") {
			this.#swapCheckStateListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: VideoEditListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: VideoEditListenerOption) {
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

	emitVideoAttrChange(params: VideoAttrChange) {
		for (const listener of this.#onVideoAttrChangeListeners) {
			listener(params);
		}
	}

	emitDelete() {
		for (const listener of this.#onDeleteListeners) {
			listener();
		}
	}

	emitSwap(params: VideoEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		poster,
		title,
		controls,
		autoplay,
		loop,
		muted,
		swapCheckState,
	}: UpdateVideoPopoverStateParams) {
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

		if (poster !== undefined) {
			this.#poster = poster;

			for (const listener of this.#posterListeners) {
				listener(this.#poster);
			}
		}

		if (title !== undefined) {
			this.#title = title;

			for (const listener of this.#titleListeners) {
				listener(this.#title);
			}
		}

		if (controls !== undefined) {
			this.#controls = controls;

			for (const listener of this.#controlsListeners) {
				listener(this.#controls);
			}
		}

		if (autoplay !== undefined) {
			this.#autoplay = autoplay;

			for (const listener of this.#autoplayListeners) {
				listener(this.#autoplay);
			}
		}

		if (loop !== undefined) {
			this.#loop = loop;

			for (const listener of this.#loopListeners) {
				listener(this.#loop);
			}
		}

		if (muted !== undefined) {
			this.#muted = muted;

			for (const listener of this.#mutedListeners) {
				listener(this.#muted);
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

	get publicAPI(): VideoPort {
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

			onVideoAttrChange: (callback) => {
				this.#onVideoAttrChangeListeners.add(callback);
				return () => this.#onVideoAttrChangeListeners.delete(callback);
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
