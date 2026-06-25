import { getStyleSheetTexts } from "../../Styles";
import type { ConfigureCustomStylesParams } from "./ConfigureCustomStyles-types";

export const configureCustomStyles = ({
	editorAPI,
}: ConfigureCustomStylesParams) => {
	const { contentStyleSheetText, interactiveStyleSheetText } =
		getStyleSheetTexts();

	editorAPI.replaceCustomStyles(
		contentStyleSheetText + interactiveStyleSheetText,
	);
};
