import { AdapterBus } from "#adapters";
import { buildEditorStyleText, getHostStyleText } from "../Styles";
import { createCore } from "./CreateCore";
import type {
	ConfigureAdapterResult,
	CreateEditorParams,
	CreateEditorResult,
	RangeXEditor,
	RegisterAdapterResult,
} from "./RangeXEditor-types";
import { registerAttrValidators } from "./RegisterAttrValidators";
import { Snapshot } from "./Snapshot";

export const createEditor = ({
	licenseKey,
	storedSnapshot,
	snapshotSchema,
	adapters,
	styles,
}: CreateEditorParams): CreateEditorResult => {
	const { editorAPI } = createCore({
		licenseKey,
		storedSnapshot,
		snapshotSchema,
	});

	const editorStyleText = buildEditorStyleText(styles);

	editorAPI.replaceCustomStyles(editorStyleText);

	const { host } = editorAPI;

	const cleanupList = new Set<ConfigureAdapterResult>();

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

	registerAttrValidators({
		adapterBus,
		components: snapshotSchema.components,
	});

	const floatingContainer = document.createElement("div");

	const registeredAdapters: RegisterAdapterResult[] = [];

	for (const adapter of adapters) {
		const registeredAdapter = adapter(
			{ adapterBus, floatingContainer },
			{ editor },
		);

		registeredAdapters.push(registeredAdapter);
	}

	for (const registeredAdapter of registeredAdapters) {
		const cleanup = registeredAdapter.configure({ editorAPI });

		cleanupList.add(cleanup);
	}

	const hostStyles = getHostStyleText();

	return { editor, host, floatingContainer, hostStyles };
};
