import {
	blockComponentRole,
	type HTMLLayoutDraft,
	htmlLayoutRole,
	nestedEditableRole,
} from "@rangex/core";
import { componentsName } from "#constants";
import { createImageAttrValidators, imageAttrsShape } from "#dom-attrs";
import { createImageStorage } from "#storage";
import {
	formatNodePath,
	resolveDraftDOMAttrs,
	validateHTMLLayoutState,
	validateNestedEditableState,
} from "../../_Utilities";
import { validateBlockComponentState } from "../_Utilities";
import type {
	CreateImageValidatorParams,
	CreateImageValidatorResult,
	FindHTMLLayoutDraftParams,
	FindHTMLLayoutDraftResult,
	ValidateFigcaptionParams,
	ValidateFigcaptionResult,
	ValidateFigureParams,
	ValidateFigureResult,
	ValidateImageParams,
	ValidateImageResult,
	ValidateImgParams,
	ValidateImgResult,
} from "./ValidateImage-types";

const findHTMLLayoutDraft = ({
	childNodes,
	localName,
}: FindHTMLLayoutDraftParams): FindHTMLLayoutDraftResult =>
	childNodes.find(
		(childDraft): childDraft is HTMLLayoutDraft =>
			childDraft.editorRole === htmlLayoutRole &&
			childDraft.localName === localName,
	);

const validateImg = ({
	componentDraft,
	htmlLayoutDraft,
	imgAttrValidators,
}: ValidateImgParams): ValidateImgResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "img",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: imageAttrsShape.img,
		elementAttrValidators: imgAttrValidators,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	if (htmlLayoutDraft.childNodes.length) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ componentDraft, nodeDraft: htmlLayoutDraft })}: must have no children.`,
		};
	}

	return null;
};

/*
 * Validates the figcaption and its only child, the NestedEditable created by setImageCaptionEnabled. The
 * NestedEditable's content is left to the engine's validation.
 */
const validateFigcaption = ({
	componentDraft,
	htmlLayoutDraft,
}: ValidateFigcaptionParams): ValidateFigcaptionResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "figcaption",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const nestedEditableDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${nestedEditableRole}.`,
		};
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			display: "block single-line",
			editState: "true",
			allowedComponents: null,
			allowedContentLineLocalNames: null,
			allowedContentLineStyleAttrNames: null,
			allowedGlyphFormatterStyleAttrNames: null,
			allowedGlyphFormatterInlineTags: null,
			domAttrs: {},
			customStorage: null,
		},
	});

	if (nestedEditableFailed) {
		return nestedEditableFailed;
	}

	return null;
};

/*
 * Validates the figure and its children: exactly one img, and at most one figcaption, above or below it.
 */
const validateFigure = ({
	componentDraft,
	htmlLayoutDraft,
	imgAttrValidators,
}: ValidateFigureParams): ValidateFigureResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: "figure",
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const imgDraft = findHTMLLayoutDraft({ childNodes, localName: "img" });

	const figcaptionDraft = findHTMLLayoutDraft({
		childNodes,
		localName: "figcaption",
	});

	// The img, and the figcaption if there's one: any other child (e.g. a second img) changes the count
	const expectedLength = [imgDraft, figcaptionDraft].filter(Boolean).length;

	if (!imgDraft || childNodes.length !== expectedLength) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one img, and at most one figcaption.`,
		};
	}

	const imgFailed = validateImg({
		componentDraft,
		htmlLayoutDraft: imgDraft,
		imgAttrValidators,
	});

	if (imgFailed) {
		return imgFailed;
	}

	if (figcaptionDraft) {
		const figcaptionFailed = validateFigcaption({
			componentDraft,
			htmlLayoutDraft: figcaptionDraft,
		});

		if (figcaptionFailed) {
			return figcaptionFailed;
		}
	}

	return null;
};

/*
 * Validates an Image and everything down to its figcaption's NestedEditable, node by node: each node's own state, then
 * its children. The block's and the img's domAttrs are resolved by imageAttrsShape and the given validators, the
 * figure's and the figcaption's by an empty shape. The NestedEditable's content is left to the engine's validation.
 */
const validateImage = ({
	componentDraft,
	attrValidators,
}: ValidateImageParams): ValidateImageResult => {
	if (componentDraft.editorRole !== blockComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ componentDraft, nodeDraft: componentDraft })}: must be a ${blockComponentRole}.`,
		};
	}

	const stateFailed = validateBlockComponentState({
		blockComponentDraft: componentDraft,
		expectedState: {
			editorRole: blockComponentRole,
			name: componentsName.image,
			content: { type: "custom" },
			editState: "false",
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: true,
			customStorage: createImageStorage(),
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		componentDraft,
		elementDraft: componentDraft,
		elementAttrsShape: imageAttrsShape.block,
		elementAttrValidators: attrValidators.block,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = componentDraft;

	const htmlLayoutDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		htmlLayoutDraft?.editorRole !== htmlLayoutRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const figureFailed = validateFigure({
		componentDraft,
		htmlLayoutDraft,
		imgAttrValidators: attrValidators.img,
	});

	if (figureFailed) {
		return figureFailed;
	}

	return null;
};

/*
 * Creates the Image's ComponentValidator, which validates the Images' attributes by the default validators, replaced
 * by the given ones (see createImageAttrValidators).
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
