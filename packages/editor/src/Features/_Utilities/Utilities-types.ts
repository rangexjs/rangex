import type { EditorAPI } from "rich-text-area";
import type { AdapterBus } from "#adapters";

export interface ConfigureFeatureParams<ConfigPort> {
	adapterBus: AdapterBus;
	configPort: ConfigPort;
	editorAPI: EditorAPI;
}
