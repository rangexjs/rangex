import {
	createAccordionItemAttrValidators,
	createAudioAttrValidators,
	createCodeBlockAttrValidators,
	createEmbedAttrValidators,
	createImageAttrValidators,
	createLinkAttrValidators,
	createVideoAttrValidators,
} from "#dom-attrs";
import type { RegisterAttrValidatorsParams } from "./RegisterAttrValidators-types";

/*
 * Registers the attribute validators of every given component, for its Adapter to read them. A component left out has
 * none, so its Adapter fails when it's created.
 */
export const registerAttrValidators = ({
	adapterBus,
	components,
}: RegisterAttrValidatorsParams) => {
	const { accordionItem, audio, codeBlock, embed, image, link, video } =
		components;

	if (accordionItem) {
		const { attrValidators = {} } = accordionItem;

		adapterBus.registerAttrValidators(
			"accordionItem",
			createAccordionItemAttrValidators(attrValidators),
		);
	}

	if (audio) {
		const { attrValidators = {} } = audio;

		adapterBus.registerAttrValidators(
			"audio",
			createAudioAttrValidators(attrValidators),
		);
	}

	if (codeBlock) {
		const { attrValidators = {} } = codeBlock;

		adapterBus.registerAttrValidators(
			"codeBlock",
			createCodeBlockAttrValidators(attrValidators),
		);
	}

	if (embed) {
		const { attrValidators = {} } = embed;

		adapterBus.registerAttrValidators(
			"embed",
			createEmbedAttrValidators(attrValidators),
		);
	}

	if (image) {
		const { attrValidators = {} } = image;

		adapterBus.registerAttrValidators(
			"image",
			createImageAttrValidators(attrValidators),
		);
	}

	if (link) {
		const { attrValidators = {} } = link;

		adapterBus.registerAttrValidators(
			"link",
			createLinkAttrValidators(attrValidators),
		);
	}

	if (video) {
		const { attrValidators = {} } = video;

		adapterBus.registerAttrValidators(
			"video",
			createVideoAttrValidators(attrValidators),
		);
	}
};
