import { extendObjectProperties } from "#utilities";
import {
	createBlockAlignPort,
	createBlockResize,
	createCaptionPort,
	createCommitSnapshotPort,
	createCurrentBlockPort,
	createSwapToEmptyMediaPort,
} from "../_Utilities";
import type {
	CreateVideoAdapterParams,
	CreateVideoAdapterResult,
	OnIsOpenUpdateCallbackFn,
	UpdateStateParams,
	VideoConfigPort,
	VideoConfigPortProps,
	VideoInternals,
	VideoPublicPort,
	VideoPublicPortProps,
} from "./VideoAdapter-types";

export const createVideoAdapter = (
	...params: CreateVideoAdapterParams
): CreateVideoAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("video");

	const floatingEl = document.createElement("div");
	floatingContainer.append(floatingEl);

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const internals: VideoInternals = {
		isOpen: false,
	};

	// PublicPort
	const onIsOpenUpdateListeners: Set<OnIsOpenUpdateCallbackFn> = new Set();

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentBlockPort = createCurrentBlockPort();
	const commitSnapshotPort = createCommitSnapshotPort();
	const swapToEmptyMediaPort = createSwapToEmptyMediaPort({ adapterBus });

	const updateState = ({ isOpen }: UpdateStateParams) => {
		if (isOpen !== undefined) {
			internals.isOpen = isOpen;

			for (const listener of onIsOpenUpdateListeners) {
				listener(isOpen);
			}
		}
	};

	const configPort: VideoConfigPort = extendObjectProperties(
		captionPort.configPort,
		blockAlignPort.configPort,
		currentBlockPort.configPort,
		commitSnapshotPort.configPort,
		swapToEmptyMediaPort.configPort,
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
		} satisfies VideoConfigPortProps,
	);

	const publicPort: VideoPublicPort = extendObjectProperties(
		captionPort.publicPort,
		blockAlignPort.publicPort,
		currentBlockPort.publicPort,
		commitSnapshotPort.publicPort,
		swapToEmptyMediaPort.publicPort,
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
		} satisfies VideoPublicPortProps,
	);

	return { configPort, publicPort };
};
