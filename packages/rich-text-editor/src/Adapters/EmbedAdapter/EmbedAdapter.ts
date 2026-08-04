import { type AdapterBus, adapterIds, type MediaResolveParams } from "#ports";
import { EmbedQuickActions, EmbedSwapCard } from "#ui-extensions";
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
	EmbedAdapterConstructorParams,
	EmbedAspectRatioValue,
	EmbedEditorPort,
	EmbedEmitSwapParams,
	EmbedSwapCheckState,
	EmbedUIPort,
	EmbedUpdateAlignFn,
	EmbedUpdateAspectRatioFn,
	EmbedUpdateCaptionFn,
	EmbedUpdateIsOpenFn,
	EmbedUpdateSwapCheckStateFn,
	EmbedUpdateSwapIsOpenFn,
	EmbedUpdateTitleFn,
	OnEmbedAttrChangeFn,
	OnEmbedSwapFn,
	OnEmbedToggleSwapFn,
	UpdateEmbedStateParams,
} from "./EmbedAdapter-types";

export class EmbedAdapter {
	#adapterBus: AdapterBus;
	#quickActionsOverlayMount: OverlayMount;
	#swapCardOverlayMount: OverlayMount;
	#blockResize: BlockResize;

	#align: BlockAlignValue = "center";
	#aspectRatio: EmbedAspectRatioValue = "16-9";
	#caption: CaptionState = { enabled: false, position: "below" };
	#title = "";
	#swapCheckState: EmbedSwapCheckState = { status: "idle" };
	#isOpen = false;
	#swapIsOpen = false;

	#alignListeners: Set<EmbedUpdateAlignFn> = new Set();
	#aspectRatioListeners: Set<EmbedUpdateAspectRatioFn> = new Set();
	#captionListeners: Set<EmbedUpdateCaptionFn> = new Set();
	#titleListeners: Set<EmbedUpdateTitleFn> = new Set();
	#swapCheckStateListeners: Set<EmbedUpdateSwapCheckStateFn> = new Set();
	#isOpenListeners: Set<EmbedUpdateIsOpenFn> = new Set();
	#swapIsOpenListeners: Set<EmbedUpdateSwapIsOpenFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onEmbedAttrChangeListeners: Set<OnEmbedAttrChangeFn> = new Set();
	#onSwapListeners: Set<OnEmbedSwapFn> = new Set();
	#onToggleSwapListeners: Set<OnEmbedToggleSwapFn> = new Set();

	#uiPort: EmbedUIPort | null = null;
	#editorPort: EmbedEditorPort | null = null;

	constructor(...params: EmbedAdapterConstructorParams) {
		const [_settings, { adapterBus, overlayHost }] = params;

		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("embed");

		this.#quickActionsOverlayMount = createOverlayMount({
			overlayHost,
			component: EmbedQuickActions,
			props: { uiPort: this.uiPort },
		});

		this.#swapCardOverlayMount = createOverlayMount({
			overlayHost,
			component: EmbedSwapCard,
			props: { uiPort: this.uiPort },
		});

		this.#blockResize = createBlockResize({ overlayHost });
	}

	get id() {
		return adapterIds.embed;
	}

	#updateState({
		align,
		aspectRatio,
		caption,
		title,
		swapCheckState,
		isOpen,
		swapIsOpen,
	}: UpdateEmbedStateParams) {
		if (align !== undefined) {
			this.#align = align;

			for (const listener of this.#alignListeners) {
				listener(this.#align);
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

		if (title !== undefined) {
			this.#title = title;

			for (const listener of this.#titleListeners) {
				listener(this.#title);
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

	get uiPort(): EmbedUIPort {
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

			get aspectRatio() {
				return adapter.#aspectRatio;
			},

			get caption() {
				return adapter.#caption;
			},

			get title() {
				return adapter.#title;
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

			onAspectRatioUpdate: (callback) => {
				adapter.#aspectRatioListeners.add(callback);
				return () => adapter.#aspectRatioListeners.delete(callback);
			},

			onCaptionUpdate: (callback) => {
				adapter.#captionListeners.add(callback);
				return () => adapter.#captionListeners.delete(callback);
			},

			onTitleUpdate: (callback) => {
				adapter.#titleListeners.add(callback);
				return () => adapter.#titleListeners.delete(callback);
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

			emitEmbedAttrChange: (params) => {
				for (const listener of adapter.#onEmbedAttrChangeListeners) {
					listener(params);
				}
			},

			emitSwap: (params: EmbedEmitSwapParams) => {
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

	get editorPort(): EmbedEditorPort {
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

			onEmbedAttrChange: (callback) => {
				adapter.#onEmbedAttrChangeListeners.add(callback);
				return () => adapter.#onEmbedAttrChangeListeners.delete(callback);
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
