import type { AdapterBus, MediaResolveParams } from "#ports";
import { AudioPopover } from "#ui-extensions";
import {
	type BlockAlignValue,
	type BlockResize,
	type CaptionPosition,
	type CaptionState,
	createBlockResize,
	createOverlayMount,
	type OnAlignChangeFn,
	type OnCaptionEnabledChangeFn,
	type OnCaptionPositionChangeFn,
	type OnDeleteFn,
	type OverlayMount,
} from "../_Utilities";
import type {
	AudioAdapterConstructorParams,
	AudioEditorPort,
	AudioEmitSwapParams,
	AudioSwapCheckState,
	AudioUIPort,
	AudioUpdateAlignFn,
	AudioUpdateAutoplayFn,
	AudioUpdateCaptionFn,
	AudioUpdateControlsFn,
	AudioUpdateLoopFn,
	AudioUpdateMutedFn,
	AudioUpdateSwapCheckStateFn,
	AudioUpdateTitleFn,
	OnAudioAttrChangeFn,
	OnAudioSwapFn,
	UpdateAudioStateParams,
} from "./AudioAdapter-types";

export class AudioAdapter {
	#adapterBus: AdapterBus;
	#overlayMount: OverlayMount;
	#blockResize: BlockResize;
	#swapPopoverElement: HTMLDivElement | null = null;

	#align: BlockAlignValue = "center";
	#caption: CaptionState = { enabled: false, position: "below" };
	#title = "";
	#controls = true;
	#autoplay = false;
	#loop = false;
	#muted = false;
	#swapCheckState: AudioSwapCheckState = { status: "idle" };

	#alignListeners: Set<AudioUpdateAlignFn> = new Set();
	#captionListeners: Set<AudioUpdateCaptionFn> = new Set();
	#titleListeners: Set<AudioUpdateTitleFn> = new Set();
	#controlsListeners: Set<AudioUpdateControlsFn> = new Set();
	#autoplayListeners: Set<AudioUpdateAutoplayFn> = new Set();
	#loopListeners: Set<AudioUpdateLoopFn> = new Set();
	#mutedListeners: Set<AudioUpdateMutedFn> = new Set();
	#swapCheckStateListeners: Set<AudioUpdateSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onAudioAttrChangeListeners: Set<OnAudioAttrChangeFn> = new Set();
	#onSwapListeners: Set<OnAudioSwapFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();

	#uiPort: AudioUIPort | null = null;
	#editorPort: AudioEditorPort | null = null;

	constructor(...params: AudioAdapterConstructorParams) {
		const [_settings, { adapterBus, overlayHost }] = params;

		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("audio");

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: AudioPopover,
			getProps: () => ({ uiPort: this.uiPort }),
		});

		this.#blockResize = createBlockResize({ overlayHost });
	}

	#updateState({
		align,
		caption,
		title,
		controls,
		autoplay,
		loop,
		muted,
		swapCheckState,
	}: UpdateAudioStateParams) {
		if (align !== undefined) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
			}
		}

		if (caption !== undefined) {
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

		if (swapCheckState !== undefined) {
			this.#swapCheckState = swapCheckState;

			for (const listener of this.#swapCheckStateListeners) {
				listener(this.#swapCheckState);
			}
		}
	}

	get uiPort(): AudioUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get popover() {
				return adapter.#overlayMount.uiOverlayMount;
			},

			swapPopover: {
				setElement: (element) => {
					adapter.#swapPopoverElement = element;
				},
			},

			get blockResize() {
				return adapter.#blockResize.uiBlockResize;
			},

			get align() {
				return adapter.#align;
			},

			get caption() {
				return adapter.#caption;
			},

			get title() {
				return adapter.#title;
			},

			get controls() {
				return adapter.#controls;
			},

			get autoplay() {
				return adapter.#autoplay;
			},

			get loop() {
				return adapter.#loop;
			},

			get muted() {
				return adapter.#muted;
			},

			get swapCheckState() {
				return adapter.#swapCheckState;
			},

			onAlignUpdate: (callback) => {
				adapter.#alignListeners.add(callback);
				return () => adapter.#alignListeners.delete(callback);
			},

			onCaptionUpdate: (callback) => {
				adapter.#captionListeners.add(callback);
				return () => adapter.#captionListeners.delete(callback);
			},

			onTitleUpdate: (callback) => {
				adapter.#titleListeners.add(callback);
				return () => adapter.#titleListeners.delete(callback);
			},

			onControlsUpdate: (callback) => {
				adapter.#controlsListeners.add(callback);
				return () => adapter.#controlsListeners.delete(callback);
			},

			onAutoplayUpdate: (callback) => {
				adapter.#autoplayListeners.add(callback);
				return () => adapter.#autoplayListeners.delete(callback);
			},

			onLoopUpdate: (callback) => {
				adapter.#loopListeners.add(callback);
				return () => adapter.#loopListeners.delete(callback);
			},

			onMutedUpdate: (callback) => {
				adapter.#mutedListeners.add(callback);
				return () => adapter.#mutedListeners.delete(callback);
			},

			onSwapCheckStateUpdate: (callback) => {
				adapter.#swapCheckStateListeners.add(callback);
				return () => adapter.#swapCheckStateListeners.delete(callback);
			},

			emitAlignChange: (align) => {
				for (const listener of adapter.#onAlignChangeListeners) {
					listener(align);
				}
			},

			emitCaptionEnabledChange: (enabled) => {
				for (const listener of adapter.#onCaptionEnabledChangeListeners) {
					listener(enabled);
				}
			},

			emitCaptionPositionChange: (position: CaptionPosition) => {
				for (const listener of adapter.#onCaptionPositionChangeListeners) {
					listener(position);
				}
			},

			emitAudioAttrChange: (params) => {
				for (const listener of adapter.#onAudioAttrChangeListeners) {
					listener(params);
				}
			},

			emitSwap: (params: AudioEmitSwapParams) => {
				for (const listener of adapter.#onSwapListeners) {
					listener(params);
				}
			},

			emitDelete: () => {
				for (const listener of adapter.#onDeleteListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): AudioEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get popover() {
				return adapter.#overlayMount.editorOverlayMount;
			},

			swapPopover: {
				get element() {
					if (!adapter.#swapPopoverElement) {
						throw new Error("Swap popover element wasn't set.");
					}

					return adapter.#swapPopoverElement;
				},
			},

			get blockResize() {
				return adapter.#blockResize.editorBlockResize;
			},

			updateState: (params) => adapter.#updateState(params),

			setAlign: (align) => adapter.#updateState({ align }),

			setCaption: (caption) => adapter.#updateState({ caption }),

			onAlignChange: (callback) => {
				adapter.#onAlignChangeListeners.add(callback);
				return () => adapter.#onAlignChangeListeners.delete(callback);
			},

			onCaptionEnabledChange: (callback) => {
				adapter.#onCaptionEnabledChangeListeners.add(callback);
				return () => adapter.#onCaptionEnabledChangeListeners.delete(callback);
			},

			onCaptionPositionChange: (callback) => {
				adapter.#onCaptionPositionChangeListeners.add(callback);
				return () => adapter.#onCaptionPositionChangeListeners.delete(callback);
			},

			onAudioAttrChange: (callback) => {
				adapter.#onAudioAttrChangeListeners.add(callback);
				return () => adapter.#onAudioAttrChangeListeners.delete(callback);
			},

			onSwap: (callback) => {
				adapter.#onSwapListeners.add(callback);
				return () => adapter.#onSwapListeners.delete(callback);
			},

			onDelete: (callback) => {
				adapter.#onDeleteListeners.add(callback);
				return () => adapter.#onDeleteListeners.delete(callback);
			},

			onMediaResolve: (callback: (params: MediaResolveParams) => void) =>
				adapter.#adapterBus.onMediaResolve(callback),
		};

		return this.#editorPort;
	}
}
