import type { EditorAPI, StoredSnapshot } from "@rangex/core";

import type { AdapterOptions, AdapterPublicPorts } from "#adapters";
import type { SnapshotSchema } from "#snapshot";

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
	editor: RangeXEditor;
}

export interface ConfigureAdapterContext {
	editorAPI: EditorAPI;
}

export type ConfigureAdapterResult = () => void;

export interface RegisterAdapterResult {
	configure(context: ConfigureAdapterContext): ConfigureAdapterResult;
}

export type RegisterAdapterFn = (
	options: AdapterOptions,
	context: AdapterContext,
) => RegisterAdapterResult;

export type AdapterFactoryFn<Settings extends object> = (settings: Settings) => RegisterAdapterFn;

export interface CreateEditorParams {
	licenseKey: string;
	storedSnapshot?: StoredSnapshot;
	snapshotSchema: SnapshotSchema;
	adapters: AdapterFactoryValue[];
	styles: string;
}

export interface CreateEditorResult {
	editor: RangeXEditor;
	host: HTMLElement;
	floatingContainer: HTMLDivElement;
	hostStyles: string;
}
