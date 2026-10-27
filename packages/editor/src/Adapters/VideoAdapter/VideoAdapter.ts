import type { BlockComponent } from "@rangex/core";
import { createVideoAttrValidators, type VideoAttrsShape } from "#dom-attrs";
import { extendObjectProperties } from "#utilities";
import {
	createBlockAlignPort,
	createBlockResize,
	createCaptionPort,
	createCurrentComponentPort,
	createDOMAttrsPort,
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
	const [{ attrValidators = {} }, { adapterBus, floatingContainer }] = params;

	const videoAttrValidators = createVideoAttrValidators(attrValidators);

	adapterBus.registerAdapter("video");
	adapterBus.registerAttrValidators("video", videoAttrValidators);

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<VideoAttrsShape>();
	const swapToEmptyMediaPort = createSwapToEmptyMediaPort({ adapterBus });
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: VideoConfigPort = extendObjectProperties(
		captionPort.configPort,
		blockAlignPort.configPort,
		currentComponentPort.configPort,
		domAttrsPort.configPort,
		swapToEmptyMediaPort.configPort,
		{
			get blockResize() {
				return blockResize;
			},

			get attrValidators() {
				return videoAttrValidators;
			},

			get quickActions() {
				return quickActionsPort.configPort;
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
		currentComponentPort.publicPort,
		domAttrsPort.publicPort,
		swapToEmptyMediaPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},
		} satisfies VideoPublicPortProps,
	);

	return { configPort, publicPort };
};
