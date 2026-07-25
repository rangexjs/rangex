import type { toolbarButtonsName } from "../../Constants";
import type {
	AnchorToolbarButtonState,
	CustomComponentToolbarButtonState,
	MediaToolbarButtonState,
	SymbolsToolbarButtonState,
	TableToolbarButtonState,
} from "../../ToolbarButtonProps";

// Anchor
export interface UpdateAnchorStateParams extends AnchorToolbarButtonState {}

export type UpdateAnchorStateFn = (params: UpdateAnchorStateParams) => void;

// CustomComponent
export interface UpdateCustomComponentStateParams
	extends CustomComponentToolbarButtonState {}

export type UpdateCustomComponentStateFn = (
	params: UpdateCustomComponentStateParams,
) => void;

// Media
export interface UpdateMediaStateParams extends MediaToolbarButtonState {}

export type UpdateMediaStateFn = (params: UpdateMediaStateParams) => void;

// Symbols
export interface UpdateSymbolsStateParams extends SymbolsToolbarButtonState {}

export type UpdateSymbolsStateFn = (params: UpdateSymbolsStateParams) => void;

// Table
export interface UpdateTableStateParams extends TableToolbarButtonState {}

export type UpdateTableStateFn = (params: UpdateTableStateParams) => void;

export interface NodeInsertionButtonsState {
	anchor: Partial<AnchorToolbarButtonState>;
	customComponent: Partial<CustomComponentToolbarButtonState>;
	media: Partial<MediaToolbarButtonState>;
	symbols: Partial<SymbolsToolbarButtonState>;
	table: Partial<TableToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
	[toolbarButtonsName.anchor]: UpdateAnchorStateFn;
	[toolbarButtonsName.customComponent]: UpdateCustomComponentStateFn;
	[toolbarButtonsName.media]: UpdateMediaStateFn;
	[toolbarButtonsName.symbols]: UpdateSymbolsStateFn;
	[toolbarButtonsName.table]: UpdateTableStateFn;
	statechange: () => void;
};

export type ListenerOption = {
	[Key in keyof ListenerMap]: { type: Key; callback: ListenerMap[Key] };
}[keyof ListenerMap];

export type UpdateListenerParams = ListenerOption & {
	operation: "add" | "delete";
};

export interface UpdateNodeInsertionButtonsStateParams
	extends Partial<NodeInsertionButtonsState> {}
