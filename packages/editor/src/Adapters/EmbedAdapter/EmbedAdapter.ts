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
	CreateEmbedAdapterParams,
	CreateEmbedAdapterResult,
	EmbedConfigPort,
	EmbedConfigPortProps,
	EmbedInternals,
	EmbedPublicPort,
	EmbedPublicPortProps,
	OnIsOpenUpdateCallbackFn,
	UpdateStateParams,
} from "./EmbedAdapter-types";

export const createEmbedAdapter = (
	...params: CreateEmbedAdapterParams
): CreateEmbedAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("embed");

	const floatingEl = document.createElement("div");
	floatingContainer.append(floatingEl);

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const internals: EmbedInternals = {
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

	const configPort: EmbedConfigPort = extendObjectProperties(
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
		} satisfies EmbedConfigPortProps,
	);

	const publicPort: EmbedPublicPort = extendObjectProperties(
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
		} satisfies EmbedPublicPortProps,
	);

	return { configPort, publicPort };
};
