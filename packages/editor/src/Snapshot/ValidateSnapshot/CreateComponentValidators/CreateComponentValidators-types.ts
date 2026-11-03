import type {
	CreateAccordionItemValidatorParams,
	CreateAudioValidatorParams,
	CreateBlockQuoteValidatorParams,
	CreateCodeBlockValidatorParams,
	CreateEmbedValidatorParams,
	CreateEmptyMediaValidatorParams,
	CreateImageValidatorParams,
	CreateListValidatorParams,
	CreateSeparatorValidatorParams,
	CreateTableValidatorParams,
	CreateTodoListValidatorParams,
	CreateVideoValidatorParams,
} from "../ValidateBlockComponents";
import type {
	CreateLinkValidatorParams,
	CreateMentionValidatorParams,
	CreateTemplateVariableValidatorParams,
} from "../ValidateInlineComponents";
import type { ComponentValidator } from "../ValidateSnapshot-types";

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
	list?: CreateListValidatorParams;
	mention?: CreateMentionValidatorParams;
	separator?: CreateSeparatorValidatorParams;
	table?: CreateTableValidatorParams;
	templateVariable?: CreateTemplateVariableValidatorParams;
	todoList?: CreateTodoListValidatorParams;
	video?: CreateVideoValidatorParams;
}

export interface CreateComponentValidatorsParams {
	components: SnapshotComponents;
}

export type CreateComponentValidatorsResult = ComponentValidator[];
