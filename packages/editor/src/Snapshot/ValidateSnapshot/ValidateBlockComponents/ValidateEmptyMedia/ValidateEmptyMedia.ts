import { blockComponentRole, detachedContextRole } from "@rangex/core";
import { componentsName } from "#constants";
import { emptyMediaStoragePattern } from "#storage";
import { formatNodePath, resolveDraftDOMAttrs } from "../../_Utilities";
import {
	validateBlockComponentLine,
	validateBlockComponentState,
} from "../_Utilities";
import type {
	CreateEmptyMediaValidatorResult,
	ValidateEmptyMediaParams,
	ValidateEmptyMediaResult,
} from "./ValidateEmptyMedia-types";

/*
 * Validates an EmptyMedia and its BlockComponentLine, node by node: each node's own state, then its children. It's built
 * as a BlockComponent holding a slot DetachedContext, which the engine's validation guarantees to be empty. It has no
 * attributes, so every attribute of these nodes is dropped.
 */
const validateEmptyMedia = ({
	componentDraft,
}: ValidateEmptyMediaParams): ValidateEmptyMediaResult => {
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
			name: componentsName.emptyMedia,
			content: { type: "custom" },
			editState: "false",
			shouldSelectBeforeRemove: true,
			shouldSelectOnNavigation: true,
			customStorage: emptyMediaStoragePattern,
		},
	});

	if (stateFailed) {
		return stateFailed;
	}

	const lineFailed = validateBlockComponentLine({
		blockComponentDraft: componentDraft,
		lineAttrsShape: {},
		lineAttrValidators: {},
	});

	if (lineFailed) {
		return lineFailed;
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: componentDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	const { childNodes } = componentDraft;

	const detachedContextDraft = childNodes.at(0);

	if (
		childNodes.length !== 1 ||
		detachedContextDraft?.editorRole !== detachedContextRole ||
		detachedContextDraft.localName !== "slot"
	) {
		return {
			sourceSnapshot: componentDraft,
			failedSnapshot: componentDraft,
			reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: must contain exactly one slot ${detachedContextRole}.`,
		};
	}

	const detachedContextAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: componentDraft,
		elementDraft: detachedContextDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (detachedContextAttrsFailed) {
		return detachedContextAttrsFailed;
	}

	return null;
};

/*
 * Creates the EmptyMedia's ComponentValidator.
 */
export const createEmptyMediaValidator =
	(): CreateEmptyMediaValidatorResult => {
		return {
			name: componentsName.emptyMedia,
			validate: ({ componentDraft }) => validateEmptyMedia({ componentDraft }),
		};
	};
