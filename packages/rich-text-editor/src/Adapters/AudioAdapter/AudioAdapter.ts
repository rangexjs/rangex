import { type AdapterBus, adapterIds, type MediaResolveParams } from "#ports";
import { AudioQuickActions, AudioSwapCard } from "#ui-extensions";
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
	type OverlayMount,
	type UploadMediaFileFn,
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
	AudioUpdateIsQuickActionsOpenFn,
	AudioUpdateIsSwapCardOpenFn,
	AudioUpdateLoopFn,
	AudioUpdateMutedFn,
	AudioUpdateSwapCheckStateFn,
	AudioUpdateTitleFn,
	OnAudioAttrChangeFn,
	OnAudioSwapFn,
	OnAudioToggleSwapFn,
	UpdateAudioStateParams,
} from "./AudioAdapter-types";

export class AudioAdapter {
	#adapterBus: AdapterBus;
	#quickActionsOverlayMount: OverlayMount;
	#swapCardOverlayMount: OverlayMount;
	#blockResize: BlockResize;
	#uploadFile: UploadMediaFileFn;

	#align: BlockAlignValue = "center";
	#caption: CaptionState = { enabled: false, position: "below" };
	#title = "";
	#controls = true;
	#autoplay = false;
	#loop = false;
	#muted = false;
	#swapCheckState: AudioSwapCheckState = { status: "idle" };
	#isQuickActionsOpen = false;
	#isSwapCardOpen = false;

	#alignListeners: Set<AudioUpdateAlignFn> = new Set();
	#captionListeners: Set<AudioUpdateCaptionFn> = new Set();
	#titleListeners: Set<AudioUpdateTitleFn> = new Set();
	#controlsListeners: Set<AudioUpdateControlsFn> = new Set();
	#autoplayListeners: Set<AudioUpdateAutoplayFn> = new Set();
	#loopListeners: Set<AudioUpdateLoopFn> = new Set();
	#mutedListeners: Set<AudioUpdateMutedFn> = new Set();
	#swapCheckStateListeners: Set<AudioUpdateSwapCheckStateFn> = new Set();
	#isQuickActionsOpenListeners: Set<AudioUpdateIsQuickActionsOpenFn> =
		new Set();
	#isSwapCardOpenListeners: Set<AudioUpdateIsSwapCardOpenFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onAudioAttrChangeListeners: Set<OnAudioAttrChangeFn> = new Set();
	#onSwapListeners: Set<OnAudioSwapFn> = new Set();
	#onToggleSwapListeners: Set<OnAudioToggleSwapFn> = new Set();

	#uiPort: AudioUIPort | null = null;
	#editorPort: AudioEditorPort | null = null;

	constructor(...params: AudioAdapterConstructorParams) {
		const [{ uploadFile }, { adapterBus, overlayHost }] = params;

		this.#uploadFile = uploadFile;
		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("audio");

		this.#quickActionsOverlayMount = createOverlayMount({
			overlayHost,
			component: AudioQuickActions,
			props: { uiPort: this.uiPort },
		});

		this.#swapCardOverlayMount = createOverlayMount({
			overlayHost,
			component: AudioSwapCard,
			props: { uiPort: this.uiPort },
		});

		this.#blockResize = createBlockResize({ overlayHost });
	}

	get id() {
		return adapterIds.audio;
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
		isQuickActionsOpen,
		isSwapCardOpen,
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

		if (isQuickActionsOpen !== undefined) {
			this.#isQuickActionsOpen = isQuickActionsOpen;

			for (const listener of this.#isQuickActionsOpenListeners) {
				listener(this.#isQuickActionsOpen);
			}
		}

		if (isSwapCardOpen !== undefined) {
			this.#isSwapCardOpen = isSwapCardOpen;

			for (const listener of this.#isSwapCardOpenListeners) {
				listener(this.#isSwapCardOpen);
			}
		}
	}

	get uiPort(): AudioUIPort {
		const adapter = this;

		this.#uiPort ??= {
			get quickActionsOverlay() {
				return adapter.#quickActionsOverlayMount.uiOverlayMount;
			},

			get swapCardOverlay() {
				return adapter.#swapCardOverlayMount.uiOverlayMount;
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

			get isSwapCardOpen() {
				return adapter.#isSwapCardOpen;
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

			onIsQuickActionsOpenUpdate: (callback) => {
				adapter.#isQuickActionsOpenListeners.add(callback);
				return () => adapter.#isQuickActionsOpenListeners.delete(callback);
			},

			onIsSwapCardOpenUpdate: (callback) => {
				adapter.#isSwapCardOpenListeners.add(callback);
				return () => adapter.#isSwapCardOpenListeners.delete(callback);
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

			emitToggleSwap: () => {
				for (const listener of adapter.#onToggleSwapListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): AudioEditorPort {
		const adapter = this;

		this.#editorPort ??= {
			get quickActionsOverlay() {
				return adapter.#quickActionsOverlayMount.editorOverlayMount;
			},

			get swapCardOverlay() {
				return adapter.#swapCardOverlayMount.editorOverlayMount;
			},

			get blockResize() {
				return adapter.#blockResize.editorBlockResize;
			},

			get uploadFile() {
				return adapter.#uploadFile;
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

			onToggleSwap: (callback) => {
				adapter.#onToggleSwapListeners.add(callback);
				return () => adapter.#onToggleSwapListeners.delete(callback);
			},

			onMediaResolve: (callback: (params: MediaResolveParams) => void) =>
				adapter.#adapterBus.onMediaResolve(callback),
		};

		return this.#editorPort;
	}
}
