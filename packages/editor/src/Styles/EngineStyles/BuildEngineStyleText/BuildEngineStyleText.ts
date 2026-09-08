import { BlockComponentLine } from "../EditorElements";
import type {
	BuildEngineStyleTextResult,
	EngineStyles,
} from "./BuildEngineStyleText-types";

export const buildEngineStyleText = ({
	common,
	editor,
	rendered,
}: EngineStyles): BuildEngineStyleTextResult => {
	const commonStyleText = [BlockComponentLine, common];
	const editorStyleText = [...commonStyleText, editor].join("");
	const renderedStyleText = [...commonStyleText, rendered].join("");

	return { editorStyleText, renderedStyleText };
};
