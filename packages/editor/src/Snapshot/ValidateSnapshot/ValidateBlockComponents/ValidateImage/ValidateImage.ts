import { componentsName } from "#constants";
import { createImageAttrValidators, imageAttrsShape } from "#dom-attrs";
import { imageStoragePattern } from "#storage";

import { validateSourceComponent } from "../_Utilities";
import type {
  CreateImageValidatorParams,
  CreateImageValidatorResult,
  ValidateImageParams,
  ValidateImageResult,
} from "./ValidateImage-types";

/*
 * Validates an Image as a source component (see validateSourceComponent), with `img` as its source element.
 */
const validateImage = ({
  componentDraft,
  attrValidators,
}: ValidateImageParams): ValidateImageResult => {
  const imageFailed = validateSourceComponent({
    componentDraft,
    name: componentsName.image,
    customStorage: imageStoragePattern,
    sourceElementLocalName: "img",
    lineAttrsShape: imageAttrsShape.line,
    lineAttrValidators: attrValidators.line,
    blockAttrsShape: imageAttrsShape.block,
    blockAttrValidators: attrValidators.block,
    sourceElementAttrsShape: imageAttrsShape.img,
    sourceElementAttrValidators: attrValidators.img,
  });

  if (imageFailed) {
    return imageFailed;
  }

  return null;
};

/*
 * Creates the Image's ComponentValidator, which validates the Images' attributes by the default validators, replaced by
 * the given ones (see createImageAttrValidators).
 */
export const createImageValidator = ({
  attrValidators = {},
}: CreateImageValidatorParams): CreateImageValidatorResult => {
  const imageAttrValidators = createImageAttrValidators(attrValidators);

  return {
    name: componentsName.image,
    validate: ({ componentDraft }) =>
      validateImage({ componentDraft, attrValidators: imageAttrValidators }),
  };
};
