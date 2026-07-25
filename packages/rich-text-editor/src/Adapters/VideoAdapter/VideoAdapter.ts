import type { AdapterBus, MediaResolveParams } from "#ports";
import { VideoPopover } from "#ui-extensions";
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
	OnVideoAttrChangeFn,
	OnVideoSwapFn,
	UpdateVideoStateParams,
	VideoAdapterConstructorParams,
	VideoAspectRatioValue,
	VideoEditorPort,
	VideoEmitSwapParams,
	VideoObjectFitValue,
	VideoSwapCheckState,
	VideoUIPort,
	VideoUpdateAlignFn,
	VideoUpdateAspectRatioFn,
	VideoUpdateAutoplayFn,
	VideoUpdateCaptionFn,
	VideoUpdateControlsFn,
	VideoUpdateLoopFn,
	VideoUpdateMutedFn,
	VideoUpdateObjectFitFn,
	VideoUpdatePosterFn,
	VideoUpdateSwapCheckStateFn,
	VideoUpdateTitleFn,
} from "./VideoAdapter-types";

export class VideoAdapter {
	#adapterBus: AdapterBus;
	#overlayMount: OverlayMount;
	#blockResize: BlockResize;
	#swapPopoverElement: HTMLDivElement | null = null;

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

	#alignListeners: Set<VideoUpdateAlignFn> = new Set();
	#objectFitListeners: Set<VideoUpdateObjectFitFn> = new Set();
	#aspectRatioListeners: Set<VideoUpdateAspectRatioFn> = new Set();
	#captionListeners: Set<VideoUpdateCaptionFn> = new Set();
	#posterListeners: Set<VideoUpdatePosterFn> = new Set();
	#titleListeners: Set<VideoUpdateTitleFn> = new Set();
	#controlsListeners: Set<VideoUpdateControlsFn> = new Set();
	#autoplayListeners: Set<VideoUpdateAutoplayFn> = new Set();
	#loopListeners: Set<VideoUpdateLoopFn> = new Set();
	#mutedListeners: Set<VideoUpdateMutedFn> = new Set();
	#swapCheckStateListeners: Set<VideoUpdateSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onVideoAttrChangeListeners: Set<OnVideoAttrChangeFn> = new Set();
	#onSwapListeners: Set<OnVideoSwapFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();

	#uiPort: VideoUIPort | null = null;
	#editorPort: VideoEditorPort | null = null;

	constructor(...params: VideoAdapterConstructorParams) {
		const [_settings, { adapterBus, overlayHost }] = params;

		this.#adapterBus = adapterBus;

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: VideoPopover,
			getProps: () => ({ uiPort: this.uiPort }),
		});

		this.#blockResize = createBlockResize({ overlayHost });
	}

	#updateState({
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
	}: UpdateVideoStateParams) {
		if (align !== undefined) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
			}
		}

		if (objectFit !== undefined) {
			this.#objectFit = objectFit;

			for (const listener of this.#objectFitListeners) {
				listener(this.#objectFit);
			}
		}

		if (aspectRatio !== undefined) {
			this.#aspectRatio = aspectRatio;

			for (const listener of this.#aspectRatioListeners) {
				listener(this.#aspectRatio);
			}
		}

		if (caption !== undefined) {
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

		if (swapCheckState !== undefined) {
			this.#swapCheckState = swapCheckState;

			for (const listener of this.#swapCheckStateListeners) {
				listener(this.#swapCheckState);
			}
		}
	}

	get uiPort(): VideoUIPort {
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

			get objectFit() {
				return adapter.#objectFit;
			},

			get aspectRatio() {
				return adapter.#aspectRatio;
			},

			get caption() {
				return adapter.#caption;
			},

			get poster() {
				return adapter.#poster;
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

			onObjectFitUpdate: (callback) => {
				adapter.#objectFitListeners.add(callback);
				return () => adapter.#objectFitListeners.delete(callback);
			},

			onAspectRatioUpdate: (callback) => {
				adapter.#aspectRatioListeners.add(callback);
				return () => adapter.#aspectRatioListeners.delete(callback);
			},

			onCaptionUpdate: (callback) => {
				adapter.#captionListeners.add(callback);
				return () => adapter.#captionListeners.delete(callback);
			},

			onPosterUpdate: (callback) => {
				adapter.#posterListeners.add(callback);
				return () => adapter.#posterListeners.delete(callback);
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

			emitVideoAttrChange: (params) => {
				for (const listener of adapter.#onVideoAttrChangeListeners) {
					listener(params);
				}
			},

			emitSwap: (params: VideoEmitSwapParams) => {
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

	get editorPort(): VideoEditorPort {
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

			onVideoAttrChange: (callback) => {
				adapter.#onVideoAttrChangeListeners.add(callback);
				return () => adapter.#onVideoAttrChangeListeners.delete(callback);
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
