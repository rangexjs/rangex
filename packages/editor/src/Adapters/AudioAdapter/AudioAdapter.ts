import type { BlockComponent } from "@rangex/core";
import type { AudioAttrsShape } from "#dom-attrs";
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

	adapterBus.registerAdapter("audio");

	const audioAttrValidators = adapterBus.getAttrValidators("audio");

	const blockResize = createBlockResize({ floatingContainer, xPos: 0 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<AudioAttrsShape>();
	const swapToSourcePlaceholderPort = createSwapToSourcePlaceholderPort({
		adapterBus,
	});
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: AudioConfigPort = extendObjectProperties(
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
				return audioAttrValidators;
			},

			get quickActions() {
				return quickActionsPort.configPort;
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
		currentComponentPort.publicPort,
		domAttrsPort.publicPort,
		swapToSourcePlaceholderPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},
		} satisfies AudioPublicPortProps,
	);

	return { configPort, publicPort };
};
