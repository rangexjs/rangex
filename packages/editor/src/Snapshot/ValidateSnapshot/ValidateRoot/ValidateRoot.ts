import { rootEditableRole } from "@rangex/core";
import { rootDefinitions } from "#constants";
import { createRootAttrValidators, rootAttrsShape } from "#dom-attrs";
import { rootStoragePattern } from "#storage";
import { matchJSON } from "#utilities";
import {
	describeJSONMismatch,
	resolveDraftDOMAttrs,
	resolveDraftStorage,
} from "../_Utilities";
import type {
	RootState,
	ValidateRootParams,
	ValidateRootResult,
} from "./ValidateRoot-types";

/*
 * Validates the RootEditable itself, not its children: its state must match the given type's definition (see
 * rootDefinitions), and its storage must match rootStoragePattern with that type, so a snapshot can't claim another
 * one. Then its domAttrs are resolved by the Root's shape and validators, and its storage by the consumer's
 * validateStorage (see resolveDraftStorage).
 */
export const validateRoot = ({
	rootEditableDraft,
	type,
	attrValidators = {},
	validateStorage,
}: ValidateRootParams): ValidateRootResult => {
	const {
		editorRole,
		display,
		editState,
		allowedComponents,
		allowedContentLineLocalNames,
		allowedContentLineStyleAttrNames,
		allowedGlyphFormatterStyleAttrNames,
		allowedGlyphFormatterInlineTags,
		customStorage,
	} = rootEditableDraft;

	const state: RootState = {
		editorRole,
		display,
		editState,
		allowedComponents,
		allowedContentLineLocalNames,
		allowedContentLineStyleAttrNames,
		allowedGlyphFormatterStyleAttrNames,
		allowedGlyphFormatterInlineTags,
		customStorage,
	};

	const storagePattern = { ...rootStoragePattern, type };

	const mismatch = matchJSON({
		value: state,
		pattern: {
			...rootDefinitions[type],
			editorRole: rootEditableRole,
			customStorage: storagePattern,
		},
	});

	if (mismatch) {
		return {
			sourceSnapshot: rootEditableDraft,
			failedSnapshot: rootEditableDraft,
			reason: describeJSONMismatch({
				rootDraft: rootEditableDraft,
				nodeDraft: rootEditableDraft,
				value: state,
				mismatch,
			}),
		};
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: rootEditableDraft,
		elementDraft: rootEditableDraft,
		elementAttrsShape: rootAttrsShape.root,
		elementAttrValidators: createRootAttrValidators(attrValidators).root,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const storageFailed = resolveDraftStorage({
		nodeDraft: rootEditableDraft,
		storagePattern,
		validateStorage,
	});

	if (storageFailed) {
		return storageFailed;
	}

	return null;
};
