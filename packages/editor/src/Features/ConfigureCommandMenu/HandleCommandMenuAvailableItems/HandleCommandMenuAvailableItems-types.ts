import type { BlockContentLineLocalName, EditorAPI } from "@rangex/core";
import type { AdapterBus } from "#adapters";
import type {
	CommandMenuConfigPort,
	CommandMenuItemValue,
} from "#adapters/CommandMenu";
import type { BlockComponentName } from "#constants";
import type { BlockComponentPlacement } from "#engine-links";

export type BlockComponentItemValue = Exclude<
	CommandMenuItemValue,
	BlockContentLineLocalName
>;

export type BlockComponentItems = Record<
	BlockComponentItemValue,
	BlockComponentName
>;

export interface IsItemAvailableParams {
	value: CommandMenuItemValue;
	adapterBus: AdapterBus;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}

export type IsItemAvailableResult = boolean;

export interface HandleCommandMenuAvailableItemsParams {
	configPort: CommandMenuConfigPort;
	adapterBus: AdapterBus;
	editorAPI: EditorAPI;
	blockComponentPlacement: BlockComponentPlacement;
}
