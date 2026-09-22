import { createHTMLView } from "@rangex/editor";
import { getViewStyles } from "../../EngineStyles";
import type { CreateRichTextHTMLViewParams } from "./CreateRichTextHTMLView-types";

export const createRichTextHTMLView = ({
	storedSnapshot,
}: CreateRichTextHTMLViewParams) => {
	const styles = getViewStyles();

	const result = createHTMLView({ styles, storedSnapshot });

	return result;
};
