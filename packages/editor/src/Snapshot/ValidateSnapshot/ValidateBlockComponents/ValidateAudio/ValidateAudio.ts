import { componentsName } from "#constants";
import { audioAttrsShape, createAudioAttrValidators } from "#dom-attrs";
import { audioStoragePattern } from "#storage";

import { validateSourceComponent } from "../_Utilities";
import type {
  CreateAudioValidatorParams,
  CreateAudioValidatorResult,
  ValidateAudioParams,
  ValidateAudioResult,
} from "./ValidateAudio-types";

/*
 * Validates an Audio as a source component (see validateSourceComponent), with `audio` as its source element.
 */
const validateAudio = ({
  componentDraft,
  attrValidators,
}: ValidateAudioParams): ValidateAudioResult => {
  const audioFailed = validateSourceComponent({
    componentDraft,
    name: componentsName.audio,
    customStorage: audioStoragePattern,
    sourceElementLocalName: "audio",
    lineAttrsShape: audioAttrsShape.line,
    lineAttrValidators: attrValidators.line,
    blockAttrsShape: audioAttrsShape.block,
    blockAttrValidators: attrValidators.block,
    sourceElementAttrsShape: audioAttrsShape.audio,
    sourceElementAttrValidators: attrValidators.audio,
  });

  if (audioFailed) {
    return audioFailed;
  }

  return null;
};

/*
 * Creates the Audio's ComponentValidator, which validates the Audios' attributes by the default validators, replaced by
 * the given ones (see createAudioAttrValidators).
 */
export const createAudioValidator = ({
  attrValidators = {},
}: CreateAudioValidatorParams): CreateAudioValidatorResult => {
  const audioAttrValidators = createAudioAttrValidators(attrValidators);

  return {
    name: componentsName.audio,
    validate: ({ componentDraft }) =>
      validateAudio({ componentDraft, attrValidators: audioAttrValidators }),
  };
};
