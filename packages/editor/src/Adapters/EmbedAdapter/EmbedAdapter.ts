import type { BlockComponent } from "@rangex/core";
import { createEmbedAttrValidators, type EmbedAttrsShape } from "#dom-attrs";
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
	const [{ attrValidators = {} }, { adapterBus, floatingContainer }] = params;

	const embedAttrValidators = createEmbedAttrValidators(attrValidators);

	adapterBus.registerAdapter("embed");
	adapterBus.registerAttrValidators("embed", embedAttrValidators);

	const blockResize = createBlockResize({ floatingContainer, xPos: 16 });

	const captionPort = createCaptionPort();
	const blockAlignPort = createBlockAlignPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const domAttrsPort = createDOMAttrsPort<EmbedAttrsShape>();
	const swapToEmptyMediaPort = createSwapToEmptyMediaPort({ adapterBus });
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const configPort: EmbedConfigPort = extendObjectProperties(
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
		swapToEmptyMediaPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},
		} satisfies EmbedPublicPortProps,
	);

	return { configPort, publicPort };
};
