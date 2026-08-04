import { type AdapterBus, adapterIds, type MediaResolveParams } from "#ports";
import { ImageQuickActions, ImageSwapCard } from "#ui-extensions";
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
} from "../_Utilities";
import type {
	ImageAdapterConstructorParams,
	ImageAspectRatioValue,
	ImageEditorPort,
	ImageEmitSwapParams,
	ImageObjectFitValue,
	ImageSwapCheckState,
	ImageUIPort,
	ImageUpdateAlignFn,
	ImageUpdateAltTextFn,
	ImageUpdateAspectRatioFn,
	ImageUpdateCaptionFn,
	ImageUpdateIsOpenFn,
	ImageUpdateObjectFitFn,
	ImageUpdateSwapCheckStateFn,
	ImageUpdateSwapIsOpenFn,
	OnImageAttrChangeFn,
	OnImageSwapFn,
	OnImageToggleSwapFn,
	UpdateImageStateParams,
} from "./ImageAdapter-types";

export class ImageAdapter {
	#adapterBus: AdapterBus;
	#quickActionsOverlayMount: OverlayMount;
	#swapCardOverlayMount: OverlayMount;
	#blockResize: BlockResize;

	#align: BlockAlignValue = "center";
	#objectFit: ImageObjectFitValue = "cover";
	#aspectRatio: ImageAspectRatioValue = "auto";
	#caption: CaptionState = { enabled: false, position: "below" };
	#altText = "";
	#swapCheckState: ImageSwapCheckState = { status: "idle" };
	#isOpen = false;
	#swapIsOpen = false;

	#alignListeners: Set<ImageUpdateAlignFn> = new Set();
	#objectFitListeners: Set<ImageUpdateObjectFitFn> = new Set();
	#aspectRatioListeners: Set<ImageUpdateAspectRatioFn> = new Set();
	#captionListeners: Set<ImageUpdateCaptionFn> = new Set();
	#altTextListeners: Set<ImageUpdateAltTextFn> = new Set();
	#swapCheckStateListeners: Set<ImageUpdateSwapCheckStateFn> = new Set();
	#isOpenListeners: Set<ImageUpdateIsOpenFn> = new Set();
	#swapIsOpenListeners: Set<ImageUpdateSwapIsOpenFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onImageAttrChangeListeners: Set<OnImageAttrChangeFn> = new Set();
	#onSwapListeners: Set<OnImageSwapFn> = new Set();
	#onToggleSwapListeners: Set<OnImageToggleSwapFn> = new Set();

	#uiPort: ImageUIPort | null = null;
	#editorPort: ImageEditorPort | null = null;

	constructor(...params: ImageAdapterConstructorParams) {
		const [_settings, { adapterBus, overlayHost }] = params;

		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("image");

		this.#quickActionsOverlayMount = createOverlayMount({
			overlayHost,
			component: ImageQuickActions,
			props: { uiPort: this.uiPort },
		});

		this.#swapCardOverlayMount = createOverlayMount({
			overlayHost,
			component: ImageSwapCard,
			props: { uiPort: this.uiPort },
		});

		this.#blockResize = createBlockResize({ overlayHost });
	}

	get id() {
		return adapterIds.image;
	}

	#updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		altText,
		swapCheckState,
		isOpen,
		swapIsOpen,
	}: UpdateImageStateParams) {
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

		if (altText !== undefined) {
			this.#altText = altText;

			for (const listener of this.#altTextListeners) {
				listener(this.#altText);
			}
		}

		if (swapCheckState !== undefined) {
			this.#swapCheckState = swapCheckState;

			for (const listener of this.#swapCheckStateListeners) {
				listener(this.#swapCheckState);
			}
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#isOpenListeners) {
				listener(this.#isOpen);
			}
		}

		if (swapIsOpen !== undefined) {
			this.#swapIsOpen = swapIsOpen;

			for (const listener of this.#swapIsOpenListeners) {
				listener(this.#swapIsOpen);
			}
		}
	}

	get uiPort(): ImageUIPort {
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

			get objectFit() {
				return adapter.#objectFit;
			},

			get aspectRatio() {
				return adapter.#aspectRatio;
			},

			get caption() {
				return adapter.#caption;
			},

			get altText() {
				return adapter.#altText;
			},

			get swapCheckState() {
				return adapter.#swapCheckState;
			},

			get isOpen() {
				return adapter.#isOpen;
			},

			get swapIsOpen() {
				return adapter.#swapIsOpen;
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

			onAltTextUpdate: (callback) => {
				adapter.#altTextListeners.add(callback);
				return () => adapter.#altTextListeners.delete(callback);
			},

			onSwapCheckStateUpdate: (callback) => {
				adapter.#swapCheckStateListeners.add(callback);
				return () => adapter.#swapCheckStateListeners.delete(callback);
			},

			onIsOpenUpdate: (callback) => {
				adapter.#isOpenListeners.add(callback);
				return () => adapter.#isOpenListeners.delete(callback);
			},

			onSwapIsOpenUpdate: (callback) => {
				adapter.#swapIsOpenListeners.add(callback);
				return () => adapter.#swapIsOpenListeners.delete(callback);
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

			emitImageAttrChange: (params) => {
				for (const listener of adapter.#onImageAttrChangeListeners) {
					listener(params);
				}
			},

			emitSwap: (params: ImageEmitSwapParams) => {
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

	get editorPort(): ImageEditorPort {
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

			onImageAttrChange: (callback) => {
				adapter.#onImageAttrChangeListeners.add(callback);
				return () => adapter.#onImageAttrChangeListeners.delete(callback);
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
