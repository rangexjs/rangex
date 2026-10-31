import {
	createAccordionItemValidator,
	createAudioValidator,
	createEmbedValidator,
	createImageValidator,
	createVideoValidator,
} from "../ValidateBlockComponents";
import {
	createLinkValidator,
	createMentionValidator,
} from "../ValidateInlineComponents";
import type {
	CreateComponentValidatorsParams,
	CreateComponentValidatorsResult,
} from "./CreateComponentValidators-types";

/*
 * Creates the validator of every given component, the ones left out don't get one.
 */
export const createComponentValidators = ({
	components,
}: CreateComponentValidatorsParams): CreateComponentValidatorsResult => {
	const { accordionItem, audio, embed, image, link, mention, video } =
		components;

	const componentValidators: CreateComponentValidatorsResult = [];

	if (accordionItem) {
		componentValidators.push(createAccordionItemValidator(accordionItem));
	}

	if (audio) {
		componentValidators.push(createAudioValidator(audio));
	}

	if (embed) {
		componentValidators.push(createEmbedValidator(embed));
	}

	if (image) {
		componentValidators.push(createImageValidator(image));
	}

	if (link) {
		componentValidators.push(createLinkValidator(link));
	}

	if (mention) {
		componentValidators.push(createMentionValidator(mention));
	}

	if (video) {
		componentValidators.push(createVideoValidator(video));
	}

	return componentValidators;
};
