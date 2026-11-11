import type { BlockComponent } from "@rangex/core";

import type { VideoAttrsShape } from "#dom-attrs";
import { extendObjectProperties } from "#utilities";

import {
	createBlockAlignPort,
	createBlockResize,
	createCaptionPort,
	createCurrentComponentPort,
	createDOMAttrsPort,
	createQuickActionsPort,
	createSwapToSourcePlaceholderPort,
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

	adapterBus.registerAdapter("video");

	const videoAttrValidators = adapterBus.getAttrValidators("video");

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<VideoAttrsShape>();
	const swapToSourcePlaceholderPort = createSwapToSourcePlaceholderPort({
		adapterBus,
	});
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: VideoConfigPort = extendObjectProperties(
		captionPort.configPort,
		blockAlignPort.configPort,
		currentComponentPort.configPort,
		domAttrsPort.configPort,
		swapToSourcePlaceholderPort.configPort,
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
		swapToSourcePlaceholderPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},
		} satisfies VideoPublicPortProps,
	);

	return { configPort, publicPort };
};
