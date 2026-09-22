import { AdapterBus } from "#adapters";
import { buildEditorStyleText, getHostStyleText } from "../Styles";
import { createCore } from "./CreateCore";
import type {
	CreateEditorParams,
	CreateEditorResult,
	RangeXEditor,
	RegisterAdapterResult,
} from "./RangeXEditor-types";
import { Snapshot } from "./Snapshot";

export const createEditor = ({
	storedSnapshot,
	adapters,
	styles,
}: CreateEditorParams): CreateEditorResult => {
	const { editorAPI } = createCore({ storedSnapshot });

	const editorStyleText = buildEditorStyleText(styles);

	editorAPI.replaceCustomStyles(editorStyleText);

	const { host } = editorAPI;

	const cleanupList = new Set<RegisterAdapterResult>();

	const snapshot = new Snapshot({ editorAPI });

	const editor: RangeXEditor = {
		get snapshot() {
			return snapshot;
		},

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
