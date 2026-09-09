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
	CreateEmbedAdapterParams,
	CreateEmbedAdapterResult,
	EmbedConfigPort,
	EmbedConfigPortProps,
	EmbedPublicPort,
	EmbedPublicPortProps,
} from "./EmbedAdapter-types";

export const createEmbedAdapter = (
	...params: CreateEmbedAdapterParams
): CreateEmbedAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerSupportedMediaType("embed");

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentBlockPort = createCurrentBlockPort();
	const commitSnapshotPort = createCommitSnapshotPort();
	const swapToEmptyMediaPort = createSwapToEmptyMediaPort({ adapterBus });
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: EmbedConfigPort = extendObjectProperties(
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
		} satisfies EmbedConfigPortProps,
	);

	const publicPort: EmbedPublicPort = extendObjectProperties(
		captionPort.publicPort,
		blockAlignPort.publicPort,
		currentBlockPort.publicPort,
		commitSnapshotPort.publicPort,
		swapToEmptyMediaPort.publicPort,
		quickActionsPort.publicPort,
		{} satisfies EmbedPublicPortProps,
	);

	return { configPort, publicPort };
};
