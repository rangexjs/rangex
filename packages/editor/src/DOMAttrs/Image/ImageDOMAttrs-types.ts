import type {
	ComponentAttrs,
	ComponentAttrsMismatch,
	ComponentAttrsPatch,
	ComponentAttrValidatorOverrides,
	ComponentAttrValidators,
} from "../_Utilities";
import type { imageAttrsShape } from "./ImageDOMAttrs";

export type ImageAttrsShape = typeof imageAttrsShape;

export type ImageAttrs = ComponentAttrs<ImageAttrsShape>;

export type ImageAttrsPatch = ComponentAttrsPatch<ImageAttrsShape>;

export type ImageAttrValidators = ComponentAttrValidators<ImageAttrsShape>;

export type ImageAttrsMismatch = ComponentAttrsMismatch<ImageAttrsShape>;

export type CreateImageAttrValidatorsParams = ComponentAttrValidatorOverrides<ImageAttrsShape>;

export type CreateImageAttrValidatorsResult = ImageAttrValidators;
