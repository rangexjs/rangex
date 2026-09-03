import type { EditorAPI } from "rich-text-area";
import type { AdapterOptions, AdapterPublicPorts } from "#adapters";

export type RangeXEditor = {
	[Key in keyof AdapterPublicPorts]+?: AdapterPublicPorts[Key];
};

export interface AdapterContext {
	editorAPI: EditorAPI;
	editor: RangeXEditor;
}

export type RegisterAdapterFn = (
	options: AdapterOptions,
	context: AdapterContext,
) => () => void;

export type AdapterFactory<Settings extends object> = (
	settings: Settings,
) => RegisterAdapterFn;

export interface CreateEditorParams {}
