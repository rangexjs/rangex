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
	ConstructorParams,
	ImageConfigPort,
	ImagePublicPort,
	OnAlignUpdateCallbackFn,
	OnCaptionUpdateCallbackFn,
	OnIsOpenUpdateCallbackFn,
	UpdateStateParams,
} from "./ImageAdapter-types";

export class ImageAdapter {
	#adapterBus: AdapterBus;
	#floatingEl = document.createElement("div");
	#blockResize: BlockResize;

	#align: BlockAlignValue = "center";
	#caption: CaptionState = { enabled: false, position: "below" };
	#isOpen = false;

	// ConfigPort
	#onAlignChangeListeners: Set<OnAlignChangeCallbackFn> = new Set();
	#onCaptionEnabledChangeListeners: Set<OnCaptionEnabledChangeCallbackFn> =
		new Set();
	#onCaptionPositionChangeListeners: Set<OnCaptionPositionChangeCallbackFn> =
		new Set();

	// PublicPort
	#onAlignUpdateListeners: Set<OnAlignUpdateCallbackFn> = new Set();
	#onCaptionUpdateListeners: Set<OnCaptionUpdateCallbackFn> = new Set();
	#onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	#configPort: ImageConfigPort | null = null;
	#publicPort: ImagePublicPort | null = null;

	constructor(...params: ConstructorParams) {
		const [_settings, { adapterBus, floatingContainer }] = params;

		this.#adapterBus = adapterBus;
		this.#adapterBus.registerSupportedMediaType("image");

		floatingContainer.append(this.#floatingEl);

		this.#blockResize = createBlockResize({ floatingContainer, xPos: 16 });
	}

	#updateState({ align, caption, isOpen }: UpdateStateParams) {
		if (align !== undefined) {
			this.#align = align;

			for (const listener of this.#onAlignUpdateListeners) {
				listener(this.#align);
			}
		}

		if (caption !== undefined) {
			this.#caption = caption;

			for (const listener of this.#onCaptionUpdateListeners) {
				listener(this.#caption);
			}
		}

		if (isOpen !== undefined) {
			this.#isOpen = isOpen;

			for (const listener of this.#onIsOpenUpdateListeners) {
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

			get caption() {
				return adapter.#caption;
			},

			get isOpen() {
				return adapter.#isOpen;
			},

			onAlignUpdate(callback) {
				adapter.#onAlignUpdateListeners.add(callback);
				return () => adapter.#onAlignUpdateListeners.delete(callback);
			},

			onCaptionUpdate(callback) {
				adapter.#onCaptionUpdateListeners.add(callback);
				return () => adapter.#onCaptionUpdateListeners.delete(callback);
			},

			onIsOpenUpdate(callback) {
				adapter.#onIsOpenUpdateListeners.add(callback);
				return () => adapter.#onIsOpenUpdateListeners.delete(callback);
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
		};

		return this.#publicPort;
	}
}
