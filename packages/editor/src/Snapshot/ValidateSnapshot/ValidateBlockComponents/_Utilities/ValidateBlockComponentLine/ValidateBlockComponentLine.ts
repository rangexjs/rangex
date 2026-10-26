import {
	blockComponentLineRole,
	blockComponentTextHolderRole,
} from "@rangex/core";
import { matchJSON } from "#utilities";
import {
	describeJSONMismatch,
	formatNodePath,
	resolveDraftDOMAttrs,
} from "../../../_Utilities";
import type {
	BlockComponentLineState,
	BlockComponentTextHolderState,
	ValidateBlockComponentLineParams,
	ValidateBlockComponentLineResult,
	ValidateBlockComponentTextHolderParams,
	ValidateBlockComponentTextHolderResult,
} from "./ValidateBlockComponentLine-types";

/*
 * Validates a text holder. It has no attributes, so every attribute it has is dropped. Its only child, the
 * BlockComponentText, is left to the engine's validation.
 */
const validateBlockComponentTextHolder = ({
	lineDraft,
	textHolderDraft,
}: ValidateBlockComponentTextHolderParams): ValidateBlockComponentTextHolderResult => {
	const { editorRole, customStorage } = textHolderDraft;

	const textHolderState: BlockComponentTextHolderState = {
		editorRole,
		customStorage,
	};

	const textHolderMismatch = matchJSON({
		value: textHolderState,
		pattern: { editorRole: blockComponentTextHolderRole, customStorage: null },
	});

	if (textHolderMismatch) {
		return {
			sourceSnapshot: lineDraft,
			failedSnapshot: textHolderDraft,
			reason: describeJSONMismatch({
				rootDraft: lineDraft,
				nodeDraft: textHolderDraft,
				value: textHolderState,
				mismatch: textHolderMismatch,
			}),
		};
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: lineDraft,
		elementDraft: textHolderDraft,
		elementAttrsShape: {},
		elementAttrValidators: {},
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	return null;
};

/*
 * Validates the BlockComponentLine a BlockComponent is in, and its two text holders. The line's domAttrs are resolved by
 * the component's own line shape and validators, as each component decides what its line has (e.g. a block align).
 * The line's structure is left to the engine's validation, which guarantees [text holder, BlockComponent, text holder].
 * A failure in the line names its node from the line, e.g. `block-component-line > block-component-text-holder[2]`.
 */
export const validateBlockComponentLine = ({
	blockComponentDraft,
	lineAttrsShape,
	lineAttrValidators,
}: ValidateBlockComponentLineParams): ValidateBlockComponentLineResult => {
	const lineDraft = blockComponentDraft.parentElement;

	if (lineDraft?.editorRole !== blockComponentLineRole) {
		return {
			sourceSnapshot: blockComponentDraft,
			failedSnapshot: blockComponentDraft,
			reason: `${formatNodePath({ rootDraft: blockComponentDraft, nodeDraft: blockComponentDraft })}: must be in a ${blockComponentLineRole}.`,
		};
	}

	const { editorRole, customStorage, childNodes } = lineDraft;

	const lineState: BlockComponentLineState = { editorRole, customStorage };

	const lineMismatch = matchJSON({
		value: lineState,
		pattern: { editorRole: blockComponentLineRole, customStorage: null },
	});

	if (lineMismatch) {
		return {
			sourceSnapshot: lineDraft,
			failedSnapshot: lineDraft,
			reason: describeJSONMismatch({
				rootDraft: lineDraft,
				nodeDraft: lineDraft,
				value: lineState,
				mismatch: lineMismatch,
			}),
		};
	}

	const domAttrsFailed = resolveDraftDOMAttrs({
		rootDraft: lineDraft,
		elementDraft: lineDraft,
		elementAttrsShape: lineAttrsShape,
		elementAttrValidators: lineAttrValidators,
	});

	if (domAttrsFailed) {
		return domAttrsFailed;
	}

	for (const childDraft of childNodes) {
		if (childDraft.editorRole !== blockComponentTextHolderRole) {
			continue;
		}

		const textHolderFailed = validateBlockComponentTextHolder({
			lineDraft,
			textHolderDraft: childDraft,
		});

		if (textHolderFailed) {
			return textHolderFailed;
		}
	}

	return null;
};
