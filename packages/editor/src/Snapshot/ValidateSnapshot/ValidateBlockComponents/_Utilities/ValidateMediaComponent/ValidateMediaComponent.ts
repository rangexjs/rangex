import {
	blockComponentRole,
	type HTMLLayoutDraft,
	htmlLayoutRole,
	nestedEditableRole,
} from "@rangex/core";
import {
	formatNodePath,
	resolveDraftDOMAttrs,
	validateHTMLLayoutState,
	validateNestedEditableState,
} from "../../../_Utilities";
import { validateBlockComponentLine } from "../ValidateBlockComponentLine";
import { validateBlockComponentState } from "../ValidateBlockComponentState";
import type {
	FindHTMLLayoutDraftParams,
	FindHTMLLayoutDraftResult,
	ValidateFigcaptionParams,
	ValidateFigcaptionResult,
	ValidateFigureParams,
	ValidateFigureResult,
	ValidateMediaComponentParams,
	ValidateMediaComponentResult,
	ValidateMediaParams,
	ValidateMediaResult,
} from "./ValidateMediaComponent-types";

const findHTMLLayoutDraft = ({
	childNodes,
	localName,
}: FindHTMLLayoutDraftParams): FindHTMLLayoutDraftResult =>
	childNodes.find(
		(childDraft): childDraft is HTMLLayoutDraft =>
			childDraft.editorRole === htmlLayoutRole &&
			childDraft.localName === localName,
	);

const validateMedia = ({
	componentDraft,
	htmlLayoutDraft,
	mediaLocalName,
	mediaAttrsShape,
	mediaAttrValidators,
}: ValidateMediaParams): ValidateMediaResult => {
	const stateFailed = validateHTMLLayoutState({
		componentDraft,
		htmlLayoutDraft,
		expectedState: {
			editorRole: htmlLayoutRole,
			localName: mediaLocalName,
			customStorage: null,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: mediaAttrsShape,
		elementAttrValidators: mediaAttrValidators,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	if (htmlLayoutDraft.childNodes.length) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must have no children.`,
		};
	}

	return null;
};

/*
 * Validates the figcaption and its only child, the NestedEditable created by the component's setXCaptionEnabled. The
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
		rootDraft: componentDraft,
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
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${nestedEditableRole}.`,
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
 * Validates the figure and its children: exactly one media element, and at most one figcaption, above or below it.
 */
const validateFigure = ({
	componentDraft,
	htmlLayoutDraft,
	mediaLocalName,
	mediaAttrsShape,
	mediaAttrValidators,
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
		rootDraft: componentDraft,
		elementDraft: htmlLayoutDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = htmlLayoutDraft;

	const mediaDraft = findHTMLLayoutDraft({
		childNodes,
		localName: mediaLocalName,
	});

	const figcaptionDraft = findHTMLLayoutDraft({
		childNodes,
		localName: "figcaption",
	});

	// The media, and the figcaption if there's one: any other child (e.g. a second media) changes the count
	const expectedLength = [mediaDraft, figcaptionDraft].filter(Boolean).length;

	if (!mediaDraft || childNodes.length !== expectedLength) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: htmlLayoutDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: htmlLayoutDraft })}: must contain exactly one ${mediaLocalName}, and at most one figcaption.`,
		};
	}

	const mediaFailed = validateMedia({
		componentDraft,
		htmlLayoutDraft: mediaDraft,
		mediaLocalName,
		mediaAttrsShape,
		mediaAttrValidators,
	});

	if (mediaFailed) {
		return mediaFailed;
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
 * Validates a media component (Image, Video, Audio, Embed), its BlockComponentLine, and everything down to its
 * figcaption's NestedEditable, node by node: each node's own state, then its children. They're all built the same way:
 * a BlockComponent holding a figure, which holds one media element (e.g. an img) and an optional figcaption. The
 * line's, the block's and the media element's domAttrs are resolved by the given shapes and validators, the figure's
 * and the figcaption's by an empty shape. The NestedEditable's content is left to the engine's validation.
 */
export const validateMediaComponent = ({
	componentDraft,
	name,
	customStorage,
	mediaLocalName,
	lineAttrsShape,
	lineAttrValidators,
	blockAttrsShape,
	blockAttrValidators,
	mediaAttrsShape,
	mediaAttrValidators,
}: ValidateMediaComponentParams): ValidateMediaComponentResult => {
	if (componentDraft.editorRole !== blockComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be a ${blockComponentRole}.`,
		};
	}

	const stateFailed = validateBlockComponentState({
		blockComponentDraft: componentDraft,
		expectedState: {
			editorRole: blockComponentRole,
			name,
			content: { type: "custom" },
			editState: "false",
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: true,
			customStorage,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const lineFailed = validateBlockComponentLine({
		blockComponentDraft: componentDraft,
		lineAttrsShape,
		lineAttrValidators,
	});

	if (lineFailed) {
		return lineFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: componentDraft,
		elementAttrsShape: blockAttrsShape,
		elementAttrValidators: blockAttrValidators,
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
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${htmlLayoutRole}.`,
		};
	}

	const figureFailed = validateFigure({
		componentDraft,
		htmlLayoutDraft,
		mediaLocalName,
		mediaAttrsShape,
		mediaAttrValidators,
	});

	if (figureFailed) {
		return figureFailed;
	}

	return null;
};
