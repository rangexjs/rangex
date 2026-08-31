import { getStyleSheetText } from "../../Styles";
import type { ConfigureCustomStylesParams } from "./ConfigureCustomStyles-types";

export const configureCustomStyles = ({
	editorAPI,
}: ConfigureCustomStylesParams) => {
	const styleSheetText = getStyleSheetText({ rxStyle: true });

	editorAPI.replaceCustomStyles(styleSheetText);
};
