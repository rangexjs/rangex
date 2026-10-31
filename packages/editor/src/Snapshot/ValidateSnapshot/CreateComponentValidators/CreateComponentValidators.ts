import { type ComponentName, componentsName } from "#constants";
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
	createTemplateVariableValidator,
} from "../ValidateInlineComponents";
import type {
	CreateComponentValidatorsParams,
	CreateComponentValidatorsResult,
	CreateUncheckedValidatorResult,
} from "./CreateComponentValidators-types";

/*
 * Allows a component that has no validator yet, so a snapshot containing it stays valid.
 *
 * TODO: Remove it once every component has a validator
 */
const createUncheckedValidator = (
	name: ComponentName,
): CreateUncheckedValidatorResult => ({
	name,
	validate: () => null,
});

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
		componentValidators.push(
			createUncheckedValidator(componentsName.blockQuote),
		);
	}

	if (codeBlock) {
		componentValidators.push(
			createUncheckedValidator(componentsName.codeBlock),
		);
	}

	if (embed) {
		componentValidators.push(createEmbedValidator(embed));
	}

	if (emptyMedia) {
		componentValidators.push(
			createUncheckedValidator(componentsName.emptyMedia),
		);
	}

	if (image) {
		componentValidators.push(createImageValidator(image));
	}

	if (link) {
		componentValidators.push(createLinkValidator(link));
	}

	if (list) {
		componentValidators.push(createUncheckedValidator(componentsName.list));
	}

	if (mention) {
		componentValidators.push(createMentionValidator(mention));
	}

	if (separator) {
		componentValidators.push(
			createUncheckedValidator(componentsName.separator),
		);
	}

	if (table) {
		componentValidators.push(createUncheckedValidator(componentsName.table));
	}

	if (templateVariable) {
		componentValidators.push(createTemplateVariableValidator(templateVariable));
	}

	if (todoList) {
		componentValidators.push(createUncheckedValidator(componentsName.todoList));
	}

	if (video) {
		componentValidators.push(createVideoValidator(video));
	}

	return componentValidators;
};
