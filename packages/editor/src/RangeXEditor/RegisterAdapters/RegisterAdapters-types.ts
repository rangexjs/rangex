import type { EditorAPI } from "@rangex/core";

import type { SnapshotComponents } from "#snapshot";

import type { AdapterFactoryValue } from "../AdapterFactories";
import type { RangeXEditor } from "../RangeXEditor-types";

export interface RegisterAdaptersParams {
  adapters: AdapterFactoryValue[];
  components: SnapshotComponents;
  floatingContainer: HTMLDivElement;
  editor: RangeXEditor;
  editorAPI: EditorAPI;
}

export type RegisterAdaptersResult = () => void;
