import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { embedAttrsShape } from "./EmbedDOMAttrs";

export type EmbedAttrsShape = typeof embedAttrsShape;

export type EmbedAttrs = ComponentAttrs<EmbedAttrsShape>;

export type EmbedAttrsPatch = ComponentAttrsPatch<EmbedAttrsShape>;

export type EmbedAttrValidators = ComponentAttrValidators<EmbedAttrsShape>;

export type EmbedAttrsMismatch = ComponentAttrsMismatch<EmbedAttrsShape>;

export type CreateEmbedAttrValidatorsParams = ComponentAttrValidatorOverrides<EmbedAttrsShape>;

export type CreateEmbedAttrValidatorsResult = EmbedAttrValidators;
