import type {
	CreateAccordionItemValidatorParams,
	CreateAudioValidatorParams,
	CreateEmbedValidatorParams,
	CreateImageValidatorParams,
	CreateVideoValidatorParams,
} from "../ValidateBlockComponents";
import type {
	CreateLinkValidatorParams,
	CreateMentionValidatorParams,
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
	blockQuote?: UncheckedComponentParams;
	codeBlock?: UncheckedComponentParams;
	embed?: CreateEmbedValidatorParams;
	emptyMedia?: UncheckedComponentParams;
	image?: CreateImageValidatorParams;
	link?: CreateLinkValidatorParams;
	list?: UncheckedComponentParams;
	mention?: CreateMentionValidatorParams;
	separator?: UncheckedComponentParams;
	table?: UncheckedComponentParams;
	templateVariable?: UncheckedComponentParams;
	todoList?: UncheckedComponentParams;
	video?: CreateVideoValidatorParams;
}

export interface CreateComponentValidatorsParams {
	components: SnapshotComponents;
}

export type CreateUncheckedValidatorResult = ComponentValidator;

export type CreateComponentValidatorsResult = ComponentValidator[];
