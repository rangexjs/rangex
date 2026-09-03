import type { EditorAPI, StoredSnapshot } from "rich-text-area";
import type { AdapterOptions, AdapterPublicPorts } from "#adapters";
import type { AdapterValue } from "./AdapterFactories";

type OptionalPublicPorts = {
	[Key in keyof AdapterPublicPorts]+?: AdapterPublicPorts[Key];
};

export interface RangeXEditor extends OptionalPublicPorts {
	destroy(): void;
}

export interface AdapterContext {
	editorAPI: EditorAPI;
	editor: RangeXEditor;
}

export type RegisterAdapterResult = () => void;

export type RegisterAdapterFn = (
	options: AdapterOptions,
	context: AdapterContext,
) => RegisterAdapterResult;

export type AdapterFactory<Settings extends object> = (
	settings: Settings,
) => RegisterAdapterFn;

export interface CreateEditorParams {
	storedSnapshot?: StoredSnapshot;
	adapters: AdapterValue[];
}

export interface CreateEditorResult {
	editor: RangeXEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
}
