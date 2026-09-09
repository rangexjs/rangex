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
	AudioConfigPort,
	AudioConfigPortProps,
	AudioPublicPort,
	AudioPublicPortProps,
	CreateAudioAdapterParams,
	CreateAudioAdapterResult,
} from "./AudioAdapter-types";

export const createAudioAdapter = (
	...params: CreateAudioAdapterParams
): CreateAudioAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("audio");

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentBlockPort = createCurrentBlockPort();
	const commitSnapshotPort = createCommitSnapshotPort();
	const swapToEmptyMediaPort = createSwapToEmptyMediaPort({ adapterBus });
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: AudioConfigPort = extendObjectProperties(
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
		} satisfies AudioConfigPortProps,
	);

	const publicPort: AudioPublicPort = extendObjectProperties(
		captionPort.publicPort,
		blockAlignPort.publicPort,
		currentBlockPort.publicPort,
		commitSnapshotPort.publicPort,
		swapToEmptyMediaPort.publicPort,
		quickActionsPort.publicPort,
		{} satisfies AudioPublicPortProps,
	);

	return { configPort, publicPort };
};
