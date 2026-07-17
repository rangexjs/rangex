import { assertNever } from "../../ErrorHandling";
import type {
	OnVideoAlignChangeFn,
	OnVideoAttrChangeFn,
	OnVideoCaptionEnabledChangeFn,
	OnVideoCaptionPositionChangeFn,
	OnVideoDeleteFn,
	OnVideoSwapPopoverOpenFn,
	UpdateAutoplayFn,
	UpdateControlsFn,
	UpdateLoopFn,
	UpdateMutedFn,
	UpdatePosterFn,
	UpdateTitleFn,
	UpdateVideoAlignFn,
	UpdateVideoAspectRatioFn,
	UpdateVideoCaptionFn,
	UpdateVideoEditPopoverStateParams,
	UpdateVideoObjectFitFn,
	VideoAspectRatioValue,
	VideoAttrChange,
	VideoBlockAlignValue,
	VideoCaptionPosition,
	VideoCaptionState,
	VideoEditListenerOption,
	VideoEditPopover,
	VideoEditUpdateListenerParams,
	VideoObjectFitValue,
} from "./VideoEditPopoverController-types";

export class VideoEditPopoverController {
	#popover: HTMLDivElement | null = null;
	#align: VideoBlockAlignValue = "center";
	#objectFit: VideoObjectFitValue = "cover";
	#aspectRatio: VideoAspectRatioValue = "auto";
	#caption: VideoCaptionState = { enabled: false, position: "below" };
	#poster = "";
	#title = "";
	#controls = true;
	#autoplay = false;
	#loop = false;
	#muted = false;

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

	#onAlignChangeListeners: Set<OnVideoAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnVideoCaptionEnabledChangeFn> =
		new Set();
	#onCaptionPositionChangeListeners: Set<OnVideoCaptionPositionChangeFn> =
		new Set();
	#onVideoAttrChangeListeners: Set<OnVideoAttrChangeFn> = new Set();
	#onSwapPopoverOpenListeners: Set<OnVideoSwapPopoverOpenFn> = new Set();
	#onDeleteListeners: Set<OnVideoDeleteFn> = new Set();

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

		assertNever(type);
	}

	subscribe(params: VideoEditListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: VideoEditListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitAlignChange(align: VideoBlockAlignValue) {
		for (const listener of this.#onAlignChangeListeners) {
			listener(align);
		}
	}

	emitCaptionEnabledChange(enabled: boolean) {
		for (const listener of this.#onCaptionEnabledChangeListeners) {
			listener(enabled);
		}
	}

	emitCaptionPositionChange(position: VideoCaptionPosition) {
		for (const listener of this.#onCaptionPositionChangeListeners) {
			listener(position);
		}
	}

	emitVideoAttrChange(params: VideoAttrChange) {
		for (const listener of this.#onVideoAttrChangeListeners) {
			listener(params);
		}
	}

	emitSwapPopoverOpen() {
		for (const listener of this.#onSwapPopoverOpenListeners) {
			listener();
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
		poster,
		title,
		controls,
		autoplay,
		loop,
		muted,
	}: UpdateVideoEditPopoverStateParams) {
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
	}

	setPopover(element: HTMLDivElement) {
		this.#popover = element;
	}

	get publicAPI(): VideoEditPopover {
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

			onVideoAttrChange: (callback) => {
				this.#onVideoAttrChangeListeners.add(callback);
				return () => this.#onVideoAttrChangeListeners.delete(callback);
			},

			onSwapPopoverOpen: (callback) => {
				this.#onSwapPopoverOpenListeners.add(callback);
				return () => this.#onSwapPopoverOpenListeners.delete(callback);
			},

			onDelete: (callback) => {
				this.#onDeleteListeners.add(callback);
				return () => this.#onDeleteListeners.delete(callback);
			},
		};
	}
}
