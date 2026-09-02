import { extendObjectProperties } from "#utilities";
import {
	createBlockAlignPort,
	createBlockResize,
	createCaptionPort,
} from "../_Utilities";
import type {
	CreateImageAdapterParams,
	CreateImageAdapterResult,
	ImageConfigPort,
	ImageConfigPortProps,
	ImageInternals,
	ImagePublicPort,
	ImagePublicPortProps,
	OnIsOpenUpdateCallbackFn,
	UpdateStateParams,
} from "./ImageAdapter-types";

export const createImageAdapter = (
	...params: CreateImageAdapterParams
): CreateImageAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("image");

	const floatingEl = document.createElement("div");
	floatingContainer.append(floatingEl);

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const internals: ImageInternals = {
		isOpen: false,
	};

	// PublicPort
	const onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();

	const updateState = ({ isOpen }: UpdateStateParams) => {
		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			for (const listener of onIsOpenUpdateListeners) {
				listener(isOpen);
			}
		}
	};

	const configPort: ImageConfigPort = extendObjectProperties(
		captionPort.configPort,
		blockAlignPort.configPort,
		{
			get blockResize() {
				return blockResize;
			},

			get floatingEl() {
				return floatingEl;
			},

			updateState(params) {
				updateState(params);
			},

			onMediaResolve(callback) {
				const cleanup = adapterBus.onMediaResolve(callback);
				return () => cleanup();
			},
		} satisfies ImageConfigPortProps,
	);

	const publicPort: ImagePublicPort = extendObjectProperties(
		captionPort.publicPort,
		blockAlignPort.publicPort,
		{
			get floatingEl() {
				return floatingEl;
			},

			get isOpen() {
				return internals.isOpen;
			},

			onIsOpenUpdate(callback) {
				onIsOpenUpdateListeners.add(callback);
				return () => onIsOpenUpdateListeners.delete(callback);
			},
		} satisfies ImagePublicPortProps,
	);

	return { configPort, publicPort };
};
