import { createHTMLView } from "@rangex/editor";
import { getViewStyles } from "../../EngineStyles";
import type { CreateRichTextHTMLViewParams } from "./CreateRichTextHTMLView-types";

export const createRichTextHTMLView = ({
	storedSnapshot,
	highlightCode,
}: CreateRichTextHTMLViewParams) => {
	const styles = getViewStyles();

	const result = createHTMLView({ styles, storedSnapshot, highlightCode });

	return result;
};
