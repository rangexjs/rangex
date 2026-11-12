import { rootEditableRole } from "@rangex/core";

import { rootDefinitions } from "#constants";
import { createRootAttrValidators, rootAttrsShape } from "#dom-attrs";
import { rootStoragePattern } from "#storage";
import { matchJSON } from "#utilities";

import { describeJSONMismatch, resolveDraftDOMAttrs, resolveDraftStorage } from "../_Utilities";
import type {
	ResolveRootTypeParams,
	ResolveRootTypeResult,
	RootState,
	ValidateRootParams,
	ValidateRootResult,
} from "./ValidateRoot-types";

/*
 * The given type the storage claims. If it claims none of them, the first one: matching against it reports the storage's
 * type as the mismatch.
 */
const resolveRootType = ({
	customStorage,
	types,
}: ResolveRootTypeParams): ResolveRootTypeResult => {
	const [firstType] = types;

	const claimedType = types.find((type) => type === customStorage?.type);

	return claimedType ?? firstType;
};

/*
 * Validates the RootEditable itself, not its children: its storage must claim one of the given types, its state must
 * match that type's definition (see rootDefinitions), and its storage must match rootStoragePattern with that type.
 * Then its domAttrs are resolved by the Root's shape and validators, and its storage by the consumer's validateStorage
 * (see resolveDraftStorage).
 */
export const validateRoot = ({
	rootEditableDraft,
	types,
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

	const type = resolveRootType({ customStorage, types });

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
