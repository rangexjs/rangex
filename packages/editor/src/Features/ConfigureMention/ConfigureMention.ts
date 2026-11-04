import {
	handleCaretMenuAppearance,
	handleComponentUnwrap,
	validateMentionDisplayText,
} from "../_Utilities";
import { getMentionQuery } from "./_Utilities";
import type { ConfigureMentionParams } from "./ConfigureMention-types";
import { handleMentionSelect } from "./HandleMentionSelect";

/*
 * Wires up the mention feature: handles mention selection and unwrapping, registers the displayText's validator, and
 * manages the caret menu's appearance while typing an @-query. Returns a cleanup function.
 */
export const configureMention = ({
	configPort,
	editorAPI,
}: ConfigureMentionParams) => {
	configPort.registerValidateDisplayText((displayText) =>
		validateMentionDisplayText({ displayText }),
	);

	const selectCleanup = handleMentionSelect({
		configPort,
		editorAPI,
	});

	const unwrapCleanup = handleComponentUnwrap({
		port: configPort,
		editorAPI,
		// TODO: resolve the component once mention unwrapping is wired up
		getComponent: () => null,
	});

	const caretMenuCleanup = handleCaretMenuAppearance({
		port: configPort.caretMenu,
		editorAPI,
		getQuery: getMentionQuery,
	});

	return () => {
		selectCleanup();
		unwrapCleanup();
		caretMenuCleanup();
	};
};
