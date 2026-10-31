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

/*
 * The components a snapshot can contain, each with its validation's params: any other component makes it invalid. Pass
 * each one the same attrValidators as the component's settings.
 */
export interface SnapshotComponents {
	accordionItem?: CreateAccordionItemValidatorParams;
	audio?: CreateAudioValidatorParams;
	embed?: CreateEmbedValidatorParams;
	image?: CreateImageValidatorParams;
	link?: CreateLinkValidatorParams;
	mention?: CreateMentionValidatorParams;
	video?: CreateVideoValidatorParams;
}

export interface CreateComponentValidatorsParams {
	components: SnapshotComponents;
}

export type CreateComponentValidatorsResult = ComponentValidator[];
