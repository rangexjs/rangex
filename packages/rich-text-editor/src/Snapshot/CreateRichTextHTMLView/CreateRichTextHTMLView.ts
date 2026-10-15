import { createHTMLView } from "@rangex/editor";
import { getViewStyles } from "../../EngineStyles";
import type {
	CreateRichTextHTMLViewParams,
	CreateRichTextHTMLViewResult,
} from "./CreateRichTextHTMLView-types";

export const createRichTextHTMLView = ({
	storedSnapshot,
	limits,
	highlightCode,
}: CreateRichTextHTMLViewParams): CreateRichTextHTMLViewResult => {
	const styles = getViewStyles();

	const result = createHTMLView({
		styles,
		storedSnapshot,
		limits,
		highlightCode,
	});

	return result;
};
