import type { ConfigureReadOnlyParams } from "./ConfigureReadOnly-types";
import { handleReadOnlyToggle } from "./HandleReadOnlyToggle";

export const configureReadOnly = ({
	editorPort,
	editorAPI,
}: ConfigureReadOnlyParams) => {
	const toggleCleanup = handleReadOnlyToggle({ editorPort, editorAPI });

	return () => {
		toggleCleanup();
	};
};
