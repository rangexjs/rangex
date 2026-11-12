import { componentsName } from "#constants";
import { createEmbedAttrValidators, embedAttrsShape } from "#dom-attrs";
import { embedStoragePattern } from "#storage";

import { validateMediaComponent } from "../_Utilities";
import type {
	CreateEmbedValidatorParams,
	CreateEmbedValidatorResult,
	ValidateEmbedParams,
	ValidateEmbedResult,
} from "./ValidateEmbed-types";

/*
 * Validates an Embed as a media component (see validateMediaComponent), with `iframe` as its media element.
 */
const validateEmbed = ({
	componentDraft,
	attrValidators,
}: ValidateEmbedParams): ValidateEmbedResult => {
	const embedFailed = validateMediaComponent({
		componentDraft,
		name: componentsName.embed,
		customStorage: embedStoragePattern,
		mediaLocalName: "iframe",
		lineAttrsShape: embedAttrsShape.line,
		lineAttrValidators: attrValidators.line,
		blockAttrsShape: embedAttrsShape.block,
		blockAttrValidators: attrValidators.block,
		mediaAttrsShape: embedAttrsShape.iframe,
		mediaAttrValidators: attrValidators.iframe,
	});

	if (embedFailed) {
		return embedFailed;
	}

	return null;
};

/*
 * Creates the Embed's ComponentValidator, which validates the Embeds' attributes by the default validators, replaced by
 * the given ones (see createEmbedAttrValidators).
 */
export const createEmbedValidator = ({
	attrValidators = {},
}: CreateEmbedValidatorParams): CreateEmbedValidatorResult => {
	const embedAttrValidators = createEmbedAttrValidators(attrValidators);

	return {
		name: componentsName.embed,
		validate: ({ componentDraft }) =>
			validateEmbed({ componentDraft, attrValidators: embedAttrValidators }),
	};
};
