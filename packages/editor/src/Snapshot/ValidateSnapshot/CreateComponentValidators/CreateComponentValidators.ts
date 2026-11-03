import {
	createAccordionItemValidator,
	createAudioValidator,
	createBlockQuoteValidator,
	createCodeBlockValidator,
	createEmbedValidator,
	createEmptyMediaValidator,
	createImageValidator,
	createListValidator,
	createSeparatorValidator,
	createTableValidator,
	createTodoListValidator,
	createVideoValidator,
} from "../ValidateBlockComponents";
import {
	createLinkValidator,
	createMentionValidator,
	createTemplateVariableValidator,
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
	const {
		accordionItem,
		audio,
		blockQuote,
		codeBlock,
		embed,
		emptyMedia,
		image,
		link,
		list,
		mention,
		separator,
		table,
		templateVariable,
		todoList,
		video,
	} = components;

	const componentValidators: CreateComponentValidatorsResult = [];

	if (accordionItem) {
		componentValidators.push(createAccordionItemValidator(accordionItem));
	}

	if (audio) {
		componentValidators.push(createAudioValidator(audio));
	}

	if (blockQuote) {
		componentValidators.push(createBlockQuoteValidator());
	}

	if (codeBlock) {
		componentValidators.push(createCodeBlockValidator(codeBlock));
	}

	if (embed) {
		componentValidators.push(createEmbedValidator(embed));
	}

	if (emptyMedia) {
		componentValidators.push(createEmptyMediaValidator());
	}

	if (image) {
		componentValidators.push(createImageValidator(image));
	}

	if (link) {
		componentValidators.push(createLinkValidator(link));
	}

	if (list) {
		componentValidators.push(createListValidator());
	}

	if (mention) {
		componentValidators.push(createMentionValidator(mention));
	}

	if (separator) {
		componentValidators.push(createSeparatorValidator());
	}

	if (table) {
		componentValidators.push(createTableValidator(table));
	}

	if (templateVariable) {
		componentValidators.push(createTemplateVariableValidator(templateVariable));
	}

	if (todoList) {
		componentValidators.push(createTodoListValidator());
	}

	if (video) {
		componentValidators.push(createVideoValidator(video));
	}

	return componentValidators;
};
