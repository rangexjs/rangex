import { AdapterBus } from "#adapters";
import { buildEngineStyleText, getHostStyleText } from "../Styles";
import { createCore } from "./CreateCore";
import type {
	CreateEditorParams,
	CreateEditorResult,
	RangeXEditor,
	RegisterAdapterResult,
} from "./RangeXEditor-types";

export const createEditor = ({
	storedSnapshot,
	adapters,
	styles,
}: CreateEditorParams): CreateEditorResult => {
	const { editorAPI } = createCore({ storedSnapshot });

	const { editorStyleText } = buildEngineStyleText(styles);

	editorAPI.replaceCustomStyles(editorStyleText);

	const { host } = editorAPI;

	const cleanupList = new Set<RegisterAdapterResult>();

	const editor: RangeXEditor = {
		destroy() {
			for (const cleanup of cleanupList) {
				cleanup();
			}
		},
	};

	const adapterBus = new AdapterBus();
	const floatingContainer = document.createElement("div");

	for (const adapter of adapters) {
		const cleanup = adapter(
			{ adapterBus, floatingContainer },
			{ editorAPI, editor },
		);

		cleanupList.add(cleanup);
	}

	const hostStyles = getHostStyleText();

	return { editor, host, floatingContainer, hostStyles };
};
