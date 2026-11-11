import {
	type ContentLineDraft,
	contentLineRole,
	type EditorNodeDraft,
	type GlyphFormatterDraft,
	glyphFormatterRole,
} from "@rangex/core";

import { validateContentLine } from "./ValidateContentLine";
import type {
	ValidateFormattingElementsParams,
	ValidateFormattingElementsResult,
} from "./ValidateFormattingElements-types";
import { validateGlyphFormatter } from "./ValidateGlyphFormatter";

const isContentLineDraft = (nodeDraft: EditorNodeDraft): nodeDraft is ContentLineDraft => {
	return nodeDraft.editorRole === contentLineRole;
};

const isGlyphFormatterDraft = (nodeDraft: EditorNodeDraft): nodeDraft is GlyphFormatterDraft => {
	return nodeDraft.editorRole === glyphFormatterRole;
};

/*
 * Validates every ContentLine and GlyphFormatter in the RootEditable, the ones in components included, by
 * validateContentLine and validateGlyphFormatter. Fails on the first one that doesn't pass.
 */
export const validateFormattingElements = ({
	rootEditableDraft,
}: ValidateFormattingElementsParams): ValidateFormattingElementsResult => {
	const nodeDrafts = rootEditableDraft.queryAll(
		(nodeDraft) => isContentLineDraft(nodeDraft) || isGlyphFormatterDraft(nodeDraft),
	);

	for (const nodeDraft of nodeDrafts) {
		if (isContentLineDraft(nodeDraft)) {
			const contentLineFailed = validateContentLine({
				contentLineDraft: nodeDraft,
			});

			if (contentLineFailed) {
				return contentLineFailed;
			}
		}

		if (isGlyphFormatterDraft(nodeDraft)) {
			const glyphFormatterFailed = validateGlyphFormatter({
				glyphFormatterDraft: nodeDraft,
			});

			if (glyphFormatterFailed) {
				return glyphFormatterFailed;
			}
		}
	}

	return null;
};
