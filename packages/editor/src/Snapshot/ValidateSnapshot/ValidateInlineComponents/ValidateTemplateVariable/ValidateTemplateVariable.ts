import {
	contentLineRole,
	inlineComponentRole,
	isFormattableTextDraft,
	nestedEditableRole,
} from "@rangex/core";
import { componentsName } from "#constants";
import { templateVariableStoragePattern } from "#storage";
import {
	formatNodePath,
	resolveDraftStorage,
	validateNestedEditableState,
} from "../../_Utilities";
import { validateInlineComponentState } from "../_Utilities";
import type {
	CreateTemplateVariableValidatorParams,
	CreateTemplateVariableValidatorResult,
	ValidateTemplateVariableParams,
	ValidateTemplateVariableResult,
} from "./ValidateTemplateVariable-types";

/*
 * Validates a TemplateVariable and its NestedEditable, node by node: each node's own state, then its children. Its
 * storage must match templateVariableStoragePattern, then it's resolved by the consumer's validateStorage (see
 * resolveDraftStorage). The engine's validation guarantees that an inline NestedEditable holds one span ContentLine,
 * which must only hold FormattableTexts: resolving the display text relies on it. The display text itself isn't checked
 * here (see resolveTemplateVariableTexts).
 */
const validateTemplateVariable = ({
	componentDraft,
	validateStorage,
}: ValidateTemplateVariableParams): ValidateTemplateVariableResult => {
	if (componentDraft.editorRole !== inlineComponentRole) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must be an ${inlineComponentRole}.`,
		};
	}

	const stateFailed = validateInlineComponentState({
		inlineComponentDraft: componentDraft,
		expectedState: {
			editorRole: inlineComponentRole,
			name: componentsName.templateVariable,
			content: { type: "custom" },
			editState: "false",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: true,
			domAttrs: {},
			customStorage: templateVariableStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const storageFailed = resolveDraftStorage({
		nodeDraft: componentDraft,
		storagePattern: templateVariableStoragePattern,
		validateStorage,
	});

	if (storageFailed) {
		return storageFailed;
	}

	const { childNodes } = componentDraft;

	const nestedEditableDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		nestedEditableDraft?.editorRole !== nestedEditableRole
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one ${nestedEditableRole}.`,
		};
	}

	const nestedEditableFailed = validateNestedEditableState({
		componentDraft,
		nestedEditableDraft,
		expectedState: {
			editorRole: nestedEditableRole,
			display: "inline",
			editState: "inherit",
			allowedComponents: [],
			allowedContentLineLocalNames: [],
			allowedContentLineStyleAttrNames: [],
			allowedGlyphFormatterStyleAttrNames: [],
			allowedGlyphFormatterInlineTags: [],
			domAttrs: {},
			customStorage: null,
		},
	});

	if (nestedEditableFailed) {
		return nestedEditableFailed;
	}

	const contentLineDraft = nestedEditableDraft.childNodes.at(0);

	if (contentLineDraft?.editorRole !== contentLineRole) {
		throw new Error("Expected a ContentLine inside the NestedEditable.");
	}

	const textDrafts = contentLineDraft.childNodes.filter(isFormattableTextDraft);

	if (textDrafts.length !== contentLineDraft.childNodes.length) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: contentLineDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: contentLineDraft })}: must only contain FormattableTexts.`,
		};
	}

	return null;
};

/*
 * Creates the TemplateVariable's ComponentValidator, which resolves the TemplateVariables' storage by the given
 * validateStorage.
 */
export const createTemplateVariableValidator = ({
	validateStorage,
}: CreateTemplateVariableValidatorParams): CreateTemplateVariableValidatorResult => {
	return {
		name: componentsName.templateVariable,
		validate: ({ componentDraft }) =>
			validateTemplateVariable({ componentDraft, validateStorage }),
	};
};
