import { resolveElementAttrs } from "#dom-attrs";
import { describeElementAttrsMismatch } from "../Utilities";
import type {
	ResolveDraftDOMAttrsParams,
	ResolveDraftDOMAttrsResult,
} from "./ResolveDraftDOMAttrs-types";

/*
 * Resolves an element's domAttrs by its shape and validators (see resolveElementAttrs), and replaces them with the
 * resolved ones. An element without attributes is resolved by an empty shape, so every attribute it has is dropped.
 * Fails if they can't be resolved, naming the element by its path from the root (e.g. its component).
 */
export const resolveDraftDOMAttrs = ({
	rootDraft,
	elementDraft,
	elementAttrsShape,
	elementAttrValidators,
}: ResolveDraftDOMAttrsParams): ResolveDraftDOMAttrsResult => {
	const { domAttrs } = elementDraft;

	const resolvedDOMAttrs = resolveElementAttrs({
		elementAttrs: domAttrs,
		elementAttrsShape,
		elementAttrValidators,
	});

	if (resolvedDOMAttrs.kind === "invalid") {
		return {
			sourceSnapshot: rootDraft,
			failedSnapshot: elementDraft,
			reason: describeElementAttrsMismatch({
				rootDraft,
				nodeDraft: elementDraft,
				domAttrs,
				mismatch: resolvedDOMAttrs.mismatch,
			}),
		};
	}

	elementDraft.domAttrs = resolvedDOMAttrs.elementAttrs;

	return null;
};
