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
	AudioConfigPort,
	AudioConfigPortProps,
	AudioInternals,
	AudioPublicPort,
	AudioPublicPortProps,
	CreateAudioAdapterParams,
	CreateAudioAdapterResult,
	OnIsOpenUpdateCallbackFn,
	UpdateStateParams,
} from "./AudioAdapter-types";

export const createAudioAdapter = (
	...params: CreateAudioAdapterParams
): CreateAudioAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("audio");

	const floatingEl = document.createElement("div");
	floatingContainer.append(floatingEl);

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const internals: AudioInternals = {
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

	const configPort: AudioConfigPort = extendObjectProperties(
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
		} satisfies AudioConfigPortProps,
	);

	const publicPort: AudioPublicPort = extendObjectProperties(
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
		} satisfies AudioPublicPortProps,
	);

	return { configPort, publicPort };
};
