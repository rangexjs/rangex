import type { BlockComponent } from "@rangex/core";
import type { EmbedAttrsShape } from "#dom-attrs";
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

	adapterBus.registerAdapter("embed");

	const embedAttrValidators = adapterBus.getAttrValidators("embed");

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<EmbedAttrsShape>();
	const swapToSourcePlaceholderPort = createSwapToSourcePlaceholderPort({
		adapterBus,
	});
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: EmbedConfigPort = extendObjectProperties(
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
				return embedAttrValidators;
			},

			get quickActions() {
				return quickActionsPort.configPort;
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
		currentComponentPort.publicPort,
		domAttrsPort.publicPort,
		swapToSourcePlaceholderPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},
		} satisfies EmbedPublicPortProps,
	);

	return { configPort, publicPort };
};
