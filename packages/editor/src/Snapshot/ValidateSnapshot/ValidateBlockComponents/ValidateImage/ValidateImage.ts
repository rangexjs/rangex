import { componentsName } from "#constants";
import { createImageAttrValidators, imageAttrsShape } from "#dom-attrs";
import { imageStoragePattern } from "#storage";
import { validateMediaComponent } from "../_Utilities";
import type {
	CreateImageValidatorParams,
	CreateImageValidatorResult,
	ValidateImageParams,
	ValidateImageResult,
} from "./ValidateImage-types";

/*
 * Validates an Image as a media component (see validateMediaComponent), with `img` as its media element.
 */
const validateImage = ({
	componentDraft,
	attrValidators,
}: ValidateImageParams): ValidateImageResult => {
	const imageFailed = validateMediaComponent({
		componentDraft,
		name: componentsName.image,
		customStorage: imageStoragePattern,
		mediaLocalName: "img",
		lineAttrsShape: imageAttrsShape.line,
		lineAttrValidators: attrValidators.line,
		blockAttrsShape: imageAttrsShape.block,
		blockAttrValidators: attrValidators.block,
		mediaAttrsShape: imageAttrsShape.img,
		mediaAttrValidators: attrValidators.img,
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
