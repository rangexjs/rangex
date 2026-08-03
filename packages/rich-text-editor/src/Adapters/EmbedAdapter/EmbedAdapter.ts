import { type AdapterBus, adapterIds, type MediaResolveParams } from "#ports";
import { EmbedPopover } from "#ui-extensions";
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
	EmbedAdapterConstructorParams,
	EmbedAspectRatioValue,
	EmbedEditorPort,
	EmbedEmitSwapParams,
	EmbedSwapCheckState,
	EmbedUIPort,
	EmbedUpdateAlignFn,
	EmbedUpdateAspectRatioFn,
	EmbedUpdateCaptionFn,
	EmbedUpdateSwapCheckStateFn,
	EmbedUpdateTitleFn,
	OnEmbedAttrChangeFn,
	OnEmbedSwapFn,
	UpdateEmbedStateParams,
} from "./EmbedAdapter-types";

export class EmbedAdapter {
	#adapterBus: AdapterBus;
	#overlayMount: OverlayMount;
	#blockResize: BlockResize;
	#swapPopoverElement: HTMLDivElement | null = null;

	#align: BlockAlignValue = "center";
	#aspectRatio: EmbedAspectRatioValue = "16-9";
	#caption: CaptionState = { enabled: false, position: "below" };
	#title = "";
	#swapCheckState: EmbedSwapCheckState = { status: "idle" };

	#alignListeners: Set<EmbedUpdateAlignFn> = new Set();
	#aspectRatioListeners: Set<EmbedUpdateAspectRatioFn> = new Set();
	#captionListeners: Set<EmbedUpdateCaptionFn> = new Set();
	#titleListeners: Set<EmbedUpdateTitleFn> = new Set();
	#swapCheckStateListeners: Set<EmbedUpdateSwapCheckStateFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeFn> = new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeFn> = new Set();
	#onEmbedAttrChangeListeners: Set<OnEmbedAttrChangeFn> = new Set();
	#onSwapListeners: Set<OnEmbedSwapFn> = new Set();
	#onDeleteListeners: Set<OnDeleteFn> = new Set();

	#uiPort: EmbedUIPort | null = null;
	#editorPort: EmbedEditorPort | null = null;

	constructor(...params: EmbedAdapterConstructorParams) {
		const [_settings, { adapterBus, overlayHost }] = params;

		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("embed");

		this.#overlayMount = createOverlayMount({
			overlayHost,
			component: EmbedPopover,
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
	}

	get uiPort(): EmbedUIPort {
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

			emitDelete: () => {
				for (const listener of adapter.#onDeleteListeners) {
					listener();
				}
			},
		};

		return this.#uiPort;
	}

	get editorPort(): EmbedEditorPort {
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

			onEmbedAttrChange: (callback) => {
				adapter.#onEmbedAttrChangeListeners.add(callback);
				return () => adapter.#onEmbedAttrChangeListeners.delete(callback);
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
