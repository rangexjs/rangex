import { assertNever } from "../../ErrorHandling";
import type {
	AudioAttrChange,
	AudioBlockAlignValue,
	AudioCaptionPosition,
	AudioCaptionState,
	AudioEditListenerOption,
	AudioEditUpdateListenerParams,
	AudioEmitSwapParams,
	AudioPopover,
	AudioSwapCheckState,
	OnAudioAlignChangeFn,
	OnAudioAttrChangeFn,
	OnAudioCaptionEnabledChangeFn,
	OnAudioCaptionPositionChangeFn,
	OnAudioDeleteFn,
	OnAudioSwapFn,
	UpdateAudioAlignFn,
	UpdateAudioAutoplayFn,
	UpdateAudioCaptionFn,
	UpdateAudioControlsFn,
	UpdateAudioLoopFn,
	UpdateAudioMutedFn,
	UpdateAudioPopoverStateParams,
	UpdateAudioSwapCheckStateFn,
	UpdateAudioTitleFn,
} from "./AudioPopoverController-types";

export class AudioPopoverController {
	#popover: HTMLDivElement | null = null;
	#swapPopover: HTMLDivElement | null = null;
	#align: AudioBlockAlignValue = "center";
	#caption: AudioCaptionState = { enabled: false, position: "below" };
	#title = "";
	#controls = true;
	#autoplay = false;
	#loop = false;
	#muted = false;
	#swapCheckState: AudioSwapCheckState = { status: "idle" };

	#alignListeners: Set<UpdateAudioAlignFn> = new Set();
	#captionListeners: Set<UpdateAudioCaptionFn> = new Set();
	#titleListeners: Set<UpdateAudioTitleFn> = new Set();
	#controlsListeners: Set<UpdateAudioControlsFn> = new Set();
	#autoplayListeners: Set<UpdateAudioAutoplayFn> = new Set();
	#loopListeners: Set<UpdateAudioLoopFn> = new Set();
	#mutedListeners: Set<UpdateAudioMutedFn> = new Set();
	#swapCheckStateListeners: Set<UpdateAudioSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAudioAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnAudioCaptionEnabledChangeFn> =
		new Set();
	#onCaptionPositionChangeListeners: Set<OnAudioCaptionPositionChangeFn> =
		new Set();
	#onAudioAttrChangeListeners: Set<OnAudioAttrChangeFn> = new Set();
	#onDeleteListeners: Set<OnAudioDeleteFn> = new Set();
	#onSwapListeners: Set<OnAudioSwapFn> = new Set();

	get align() {
		return this.#align;
	}

	get caption() {
		return this.#caption;
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
	}: AudioEditUpdateListenerParams) {
		if (type === "align") {
			this.#alignListeners[operation](callback);
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

	subscribe(params: AudioEditListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: AudioEditListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	emitAlignChange(align: AudioBlockAlignValue) {
		for (const listener of this.#onAlignChangeListeners) {
			listener(align);
		}
	}

	emitCaptionEnabledChange(enabled: boolean) {
		for (const listener of this.#onCaptionEnabledChangeListeners) {
			listener(enabled);
		}
	}

	emitCaptionPositionChange(position: AudioCaptionPosition) {
		for (const listener of this.#onCaptionPositionChangeListeners) {
			listener(position);
		}
	}

	emitAudioAttrChange(params: AudioAttrChange) {
		for (const listener of this.#onAudioAttrChangeListeners) {
			listener(params);
		}
	}

	emitDelete() {
		for (const listener of this.#onDeleteListeners) {
			listener();
		}
	}

	emitSwap(params: AudioEmitSwapParams) {
		for (const listener of this.#onSwapListeners) {
			listener(params);
		}
	}

	updateState({
		align,
		caption,
		title,
		controls,
		autoplay,
		loop,
		muted,
		swapCheckState,
	}: UpdateAudioPopoverStateParams) {
		if (align) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
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

	get publicAPI(): AudioPopover {
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

			onAudioAttrChange: (callback) => {
				this.#onAudioAttrChangeListeners.add(callback);
				return () => this.#onAudioAttrChangeListeners.delete(callback);
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
