import type { EditorAPI } from "@rangex/core";
import type { AdapterBus } from "#adapters";

export interface ConfigureFeatureParams<ConfigPort> {
	adapterBus: AdapterBus;
	configPort: ConfigPort;
	editorAPI: EditorAPI;
}
