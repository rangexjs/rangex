import { componentsName } from "#constants";
import { createEmbedAttrValidators, embedAttrsShape } from "#dom-attrs";
import { embedStoragePattern } from "#storage";

import { validateSourceComponent } from "../_Utilities";
import type {
  CreateEmbedValidatorParams,
  CreateEmbedValidatorResult,
  ValidateEmbedParams,
  ValidateEmbedResult,
} from "./ValidateEmbed-types";

/*
 * Validates an Embed as a source component (see validateSourceComponent), with `iframe` as its source element.
 */
const validateEmbed = ({
  componentDraft,
  attrValidators,
}: ValidateEmbedParams): ValidateEmbedResult => {
  const embedFailed = validateSourceComponent({
    componentDraft,
    name: componentsName.embed,
    customStorage: embedStoragePattern,
    sourceElementLocalName: "iframe",
    lineAttrsShape: embedAttrsShape.line,
    lineAttrValidators: attrValidators.line,
    blockAttrsShape: embedAttrsShape.block,
    blockAttrValidators: attrValidators.block,
    sourceElementAttrsShape: embedAttrsShape.iframe,
    sourceElementAttrValidators: attrValidators.iframe,
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
