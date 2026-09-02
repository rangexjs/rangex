import type { AdapterBus } from "../_Utilities";
import {
	type BlockAlignValue,
	type BlockResize,
	type CaptionPosition,
	type CaptionState,
	createBlockResize,
	type OnAlignChangeCallbackFn,
	type OnCaptionEnabledChangeCallbackFn,
	type OnCaptionPositionChangeCallbackFn,
} from "../_Utilities";
import type {
	AspectRatioValue,
	ConstructorParams,
	ImageConfigPort,
	ImagePublicPort,
	ObjectFitValue,
	OnAlignUpdateCallbackFn,
	OnAltTextUpdateCallbackFn,
	OnAspectRationCallbackFn,
	OnCaptionUpdateCallbackFn,
	OnImageAttrChangeCallbackFn,
	OnObjectFitUpdateCallbackFn,
	OnToggleCallbackFn,
	UpdateStateParams,
} from "./ImageAdapter-types";

export class ImageAdapter {
	#adapterBus: AdapterBus;
	#floatingEl = document.createElement("div");
	#blockResize: BlockResize;

	#align: BlockAlignValue = "center";
	#objectFit: ObjectFitValue = "cover";
	#aspectRatio: AspectRatioValue = "auto";
	#caption: CaptionState = { enabled: false, position: "below" };
	#altText = "";
	#isOpen = false;

	#alignListeners: Set<OnAlignUpdateCallbackFn> = new Set();
	#objectFitListeners: Set<OnObjectFitUpdateCallbackFn> = new Set();
	#aspectRatioListeners: Set<OnAspectRationCallbackFn> = new Set();
	#captionListeners: Set<OnCaptionUpdateCallbackFn> = new Set();
	#altTextListeners: Set<OnAltTextUpdateCallbackFn> = new Set();
	#isOpenListeners: Set<OnToggleCallbackFn> = new Set();

	#onAlignChangeListeners: Set<OnAlignChangeCallbackFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeCallbackFn> =
		new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeCallbackFn> =
		new Set();
	#onImageAttrChangeListeners: Set<OnImageAttrChangeCallbackFn> = new Set();
	#onToggleListeners: Set<OnToggleCallbackFn> = new Set();

	#configPort: ImageConfigPort | null = null;
	#publicPort: ImagePublicPort | null = null;

	constructor(...params: ConstructorParams) {
		const [_settings, { adapterBus, floatingContainer }] = params;

		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("image");

		floatingContainer.append(this.#floatingEl);

		this.#blockResize = createBlockResize({ floatingContainer, xPos: 16 });
	}

	#updateState({
		align,
		objectFit,
		aspectRatio,
		caption,
		altText,
		isOpen,
	}: UpdateStateParams) {
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

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#isOpenListeners) {
				listener(this.#isOpen);
			}
		}
	}

	get configPort(): ImageConfigPort {
		const adapter = this;

		this.#configPort ??= {
			get blockResize() {
				return adapter.#blockResize;
			},

			get floatingEl() {
				return adapter.#floatingEl;
			},

			updateState(params) {
				adapter.#updateState(params);
			},

			setAlign(align) {
				adapter.#updateState({ align });
			},

			onAlignChange(callback) {
				adapter.#onAlignChangeListeners.add(callback);
				return () => adapter.#onAlignChangeListeners.delete(callback);
			},

			setCaption(caption) {
				adapter.#updateState({ caption });
			},

			onCaptionEnabledChange(callback) {
				adapter.#onCaptionEnabledChangeListeners.add(callback);
				return () => adapter.#onCaptionEnabledChangeListeners.delete(callback);
			},

			onCaptionPositionChange(callback) {
				adapter.#onCaptionPositionChangeListeners.add(callback);
				return () => adapter.#onCaptionPositionChangeListeners.delete(callback);
			},

			onImageAttrChange(callback) {
				adapter.#onImageAttrChangeListeners.add(callback);
				return () => adapter.#onImageAttrChangeListeners.delete(callback);
			},

			onMediaResolve(callback) {
				const cleanup = adapter.#adapterBus.onMediaResolve(callback);
				return () => cleanup();
			},
		};

		return this.#configPort;
	}

	get publicPort(): ImagePublicPort {
		const adapter = this;

		this.#publicPort ??= {
			get floatingEl() {
				return adapter.#floatingEl;
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

			onAlignUpdate(callback) {
				adapter.#alignListeners.add(callback);
				return () => adapter.#alignListeners.delete(callback);
			},

			onObjectFitUpdate(callback) {
				adapter.#objectFitListeners.add(callback);
				return () => adapter.#objectFitListeners.delete(callback);
			},

			onAspectRatioUpdate(callback) {
				adapter.#aspectRatioListeners.add(callback);
				return () => adapter.#aspectRatioListeners.delete(callback);
			},

			onCaptionUpdate(callback) {
				adapter.#captionListeners.add(callback);
				return () => adapter.#captionListeners.delete(callback);
			},

			onAltTextUpdate(callback) {
				adapter.#altTextListeners.add(callback);
				return () => adapter.#altTextListeners.delete(callback);
			},

			onToggle(callback) {
				adapter.#onToggleListeners.add(callback);
				return () => adapter.#onToggleListeners.delete(callback);
			},

			changeAlign(align) {
				for (const listener of adapter.#onAlignChangeListeners) {
					listener(align);
				}
			},

			changeCaptionEnabled(enabled) {
				for (const listener of adapter.#onCaptionEnabledChangeListeners) {
					listener(enabled);
				}
			},

			changeCaptionPosition(position: CaptionPosition) {
				for (const listener of adapter.#onCaptionPositionChangeListeners) {
					listener(position);
				}
			},

			changeImageAttr(params) {
				for (const listener of adapter.#onImageAttrChangeListeners) {
					listener(params);
				}
			},
		};

		return this.#publicPort;
	}
}
