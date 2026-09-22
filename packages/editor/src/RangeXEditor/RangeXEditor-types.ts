import type { EditorAPI, StoredSnapshot } from "rich-text-area";
import type { AdapterOptions, AdapterPublicPorts } from "#adapters";
import type { AdapterFactoryValue } from "./AdapterFactories";
import type { Snapshot } from "./Snapshot";

type OptionalPublicPorts = {
	[Key in keyof AdapterPublicPorts]+?: AdapterPublicPorts[Key];
};

export interface RangeXEditor extends OptionalPublicPorts {
	readonly snapshot: Snapshot;
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

export type AdapterFactoryFn<Settings extends object> = (
	settings: Settings,
) => RegisterAdapterFn;

export interface CreateEditorParams {
	storedSnapshot?: StoredSnapshot;
	adapters: AdapterFactoryValue[];
	styles: string;
}

export interface CreateEditorResult {
	editor: RangeXEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
	hostStyles: string;
}
