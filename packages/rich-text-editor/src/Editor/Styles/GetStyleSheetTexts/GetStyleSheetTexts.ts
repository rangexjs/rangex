import { getContentStyles } from "../ContentStyles";
import { getInteractiveStyles } from "../InteractiveStyles";
import interactiveStyles from "../InteractiveStyles.css?inline";

import type { GetStyleSheetTextsResult } from "./GetStyleSheetTexts-types";

export const getStyleSheetTexts = (): GetStyleSheetTextsResult => {
	const contentStyleSheetText = getContentStyles();
	const interactiveStyleSheetText = getInteractiveStyles() + interactiveStyles;

	return { contentStyleSheetText, interactiveStyleSheetText };
};
