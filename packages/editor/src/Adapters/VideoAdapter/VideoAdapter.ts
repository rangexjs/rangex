import { extendObjectProperties } from "#utilities";
import {
	createBlockAlignPort,
	createBlockResize,
	createCaptionPort,
	createCommitSnapshotPort,
	createCurrentBlockPort,
	createQuickActionsPort,
	createSwapToEmptyMediaPort,
} from "../_Utilities";
import type {
	CreateVideoAdapterParams,
	CreateVideoAdapterResult,
	VideoConfigPort,
	VideoConfigPortProps,
	VideoPublicPort,
	VideoPublicPortProps,
} from "./VideoAdapter-types";

export const createVideoAdapter = (
	...params: CreateVideoAdapterParams
): CreateVideoAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("video");

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentBlockPort = createCurrentBlockPort();
	const commitSnapshotPort = createCommitSnapshotPort();
	const swapToEmptyMediaPort = createSwapToEmptyMediaPort({ adapterBus });
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: VideoConfigPort = extendObjectProperties(
		captionPort.configPort,
		blockAlignPort.configPort,
		currentBlockPort.configPort,
		commitSnapshotPort.configPort,
		swapToEmptyMediaPort.configPort,
		quickActionsPort.configPort,
		{
			get blockResize() {
				return blockResize;
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
		quickActionsPort.publicPort,
		{} satisfies VideoPublicPortProps,
	);

	return { configPort, publicPort };
};
