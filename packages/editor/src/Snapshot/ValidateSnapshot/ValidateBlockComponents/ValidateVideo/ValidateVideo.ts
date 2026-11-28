import { componentsName } from "#constants";
import { createVideoAttrValidators, videoAttrsShape } from "#dom-attrs";
import { videoStoragePattern } from "#storage";

import { validateSourceComponent } from "../_Utilities";
import type {
  CreateVideoValidatorParams,
  CreateVideoValidatorResult,
  ValidateVideoParams,
  ValidateVideoResult,
} from "./ValidateVideo-types";

/*
 * Validates a Video as a source component (see validateSourceComponent), with `video` as its source element.
 */
const validateVideo = ({
  componentDraft,
  attrValidators,
}: ValidateVideoParams): ValidateVideoResult => {
  const videoFailed = validateSourceComponent({
    componentDraft,
    name: componentsName.video,
    customStorage: videoStoragePattern,
    sourceElementLocalName: "video",
    lineAttrsShape: videoAttrsShape.line,
    lineAttrValidators: attrValidators.line,
    blockAttrsShape: videoAttrsShape.block,
    blockAttrValidators: attrValidators.block,
    sourceElementAttrsShape: videoAttrsShape.video,
    sourceElementAttrValidators: attrValidators.video,
  });

  if (videoFailed) {
    return videoFailed;
  }

  return null;
};

/*
 * Creates the Video's ComponentValidator, which validates the Videos' attributes by the default validators, replaced by
 * the given ones (see createVideoAttrValidators).
 */
export const createVideoValidator = ({
  attrValidators = {},
}: CreateVideoValidatorParams): CreateVideoValidatorResult => {
  const videoAttrValidators = createVideoAttrValidators(attrValidators);

  return {
    name: componentsName.video,
    validate: ({ componentDraft }) =>
      validateVideo({ componentDraft, attrValidators: videoAttrValidators }),
  };
};
