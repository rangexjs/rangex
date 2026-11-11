import type { BlockComponent } from "@rangex/core";
import type { ImageAttrsShape } from "#dom-attrs";
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
	CreateImageAdapterParams,
	CreateImageAdapterResult,
	ImageConfigPort,
	ImageConfigPortProps,
	ImagePublicPort,
	ImagePublicPortProps,
} from "./ImageAdapter-types";

export const createImageAdapter = (
	...params: CreateImageAdapterParams
): CreateImageAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("image");

	const imageAttrValidators = adapterBus.getAttrValidators("image");

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<ImageAttrsShape>();
	const swapToSourcePlaceholderPort = createSwapToSourcePlaceholderPort({
		adapterBus,
	});
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: ImageConfigPort = extendObjectProperties(
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
				return imageAttrValidators;
			},

			get quickActions() {
				return quickActionsPort.configPort;
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
		currentComponentPort.publicPort,
		domAttrsPort.publicPort,
		swapToSourcePlaceholderPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},
		} satisfies ImagePublicPortProps,
	);

	return { configPort, publicPort };
};
