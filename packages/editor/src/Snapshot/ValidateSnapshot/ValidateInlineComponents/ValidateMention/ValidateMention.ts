import { inlineComponentRole, nestedEditableRole } from "@rangex/core";
import { componentsName } from "#constants";
import { mentionStoragePattern } from "#storage";
import {
	formatNodePath,
	resolveDraftStorage,
	validateNestedEditableState,
} from "../../_Utilities";
import { validateInlineComponentState } from "../_Utilities";
import type {
	CreateMentionValidatorParams,
	CreateMentionValidatorResult,
	ValidateMentionParams,
	ValidateMentionResult,
} from "./ValidateMention-types";

/*
 * Validates a Mention and its NestedEditable, node by node: each node's own state, then its children. Its storage must
 * match mentionStoragePattern, then it's resolved by the consumer's validateStorage (see resolveDraftStorage). The
 * NestedEditable's content (the "@displayName" text) is left to the engine's
 * validation, which checks it by the NestedEditable's settings.
 */
const validateMention = ({
	componentDraft,
	validateStorage,
}: ValidateMentionParams): ValidateMentionResult => {
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
			name: componentsName.mention,
			content: { type: "custom" },
			editState: "false",
			shouldSelectBeforeRemove: false,
			shouldSelectOnNavigation: false,
			domAttrs: {},
			customStorage: mentionStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const storageFailed = resolveDraftStorage({
		nodeDraft: componentDraft,
		storagePattern: mentionStoragePattern,
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
 * Creates the Mention's ComponentValidator, which resolves the Mentions' storage by the given validateStorage.
 */
export const createMentionValidator = ({
	validateStorage,
}: CreateMentionValidatorParams): CreateMentionValidatorResult => {
	return {
		name: componentsName.mention,
		validate: ({ componentDraft }) =>
			validateMention({ componentDraft, validateStorage }),
	};
};
