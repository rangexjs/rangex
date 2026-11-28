import type { StoredSnapshot } from "@rangex/core";

import type { AdapterPublicPorts } from "#adapters";
import type { SnapshotSchema } from "#snapshot";

import type { AdapterFactoryValue } from "./AdapterFactories";
import type { ResolvePlaceholderFn } from "./HandlePlaceholder";
import type { Snapshot } from "./Namespaces";

type OptionalPublicPorts = {
  [Key in keyof AdapterPublicPorts]+?: AdapterPublicPorts[Key];
};

export interface RangeXEditor extends OptionalPublicPorts {
  readonly snapshot: Snapshot;
  focus(): void;
  destroy(): void;
}

export interface CreateEditorParams {
  licenseKey: string;
  storedSnapshot?: StoredSnapshot;
  snapshotSchema: SnapshotSchema;
  adapters: AdapterFactoryValue[];
  styles: string;
  placeholder?: ResolvePlaceholderFn;
}

export interface CreateEditorResult {
  editor: RangeXEditor;
  editorContainer: HTMLDivElement;
  containerStyles: string;
}
