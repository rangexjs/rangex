import type {
	CreateAccordionItemValidatorParams,
	CreateAudioValidatorParams,
	CreateBlockQuoteValidatorParams,
	CreateCodeBlockValidatorParams,
	CreateEmbedValidatorParams,
	CreateEmptyMediaValidatorParams,
	CreateImageValidatorParams,
	CreateSeparatorValidatorParams,
	CreateVideoValidatorParams,
} from "../ValidateBlockComponents";
import type {
	CreateLinkValidatorParams,
	CreateMentionValidatorParams,
	CreateTemplateVariableValidatorParams,
} from "../ValidateInlineComponents";
import type { ComponentValidator } from "../ValidateSnapshot-types";

// TODO: Remove it once every component has a validator
export interface UncheckedComponentParams {}

/*
 * The components a snapshot can contain, each with its validation's params: any other component makes it invalid.
 */
export interface SnapshotComponents {
	accordionItem?: CreateAccordionItemValidatorParams;
	audio?: CreateAudioValidatorParams;
	blockQuote?: CreateBlockQuoteValidatorParams;
	codeBlock?: CreateCodeBlockValidatorParams;
	embed?: CreateEmbedValidatorParams;
	emptyMedia?: CreateEmptyMediaValidatorParams;
	image?: CreateImageValidatorParams;
	link?: CreateLinkValidatorParams;
	list?: UncheckedComponentParams;
	mention?: CreateMentionValidatorParams;
	separator?: CreateSeparatorValidatorParams;
	table?: UncheckedComponentParams;
	templateVariable?: CreateTemplateVariableValidatorParams;
	todoList?: UncheckedComponentParams;
	video?: CreateVideoValidatorParams;
}

export interface CreateComponentValidatorsParams {
	components: SnapshotComponents;
}

export type CreateUncheckedValidatorResult = ComponentValidator;

export type CreateComponentValidatorsResult = ComponentValidator[];
