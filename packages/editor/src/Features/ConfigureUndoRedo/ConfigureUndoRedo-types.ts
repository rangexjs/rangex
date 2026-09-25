import type { UndoRedoConfigPort } from "#adapters/UndoRedo";
import type { ConfigureFeatureParams } from "../_Utilities";

export interface ConfigureUndoRedoParams
	extends ConfigureFeatureParams<UndoRedoConfigPort> {}
