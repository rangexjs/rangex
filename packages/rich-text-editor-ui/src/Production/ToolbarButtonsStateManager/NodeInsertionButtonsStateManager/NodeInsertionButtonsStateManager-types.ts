import type { toolbarButtonsName } from "../../Constants";
import type {
	AnchorToolbarButtonState,
	BlockQuoteToolbarButtonState,
	CheckboxListToolbarButtonState,
	CodeBlockToolbarButtonState,
	CustomComponentToolbarButtonState,
	ImageToolbarButtonState,
	OrderedListToolbarButtonState,
	SymbolsToolbarButtonState,
	TableToolbarButtonState,
	TemplateVariableToolbarButtonState,
	UnorderedListToolbarButtonState,
} from "../../ToolbarButtonProps";

// Anchor
export interface UpdateAnchorStateParams extends AnchorToolbarButtonState {}

export type UpdateAnchorStateFn = (params: UpdateAnchorStateParams) => void;

// CheckboxList
export interface UpdateCheckboxListStateParams
	extends CheckboxListToolbarButtonState {}

export type UpdateCheckboxListStateFn = (
	params: UpdateCheckboxListStateParams,
) => void;

// BlockQuote
export interface UpdateBlockQuoteStateParams
	extends BlockQuoteToolbarButtonState {}

export type UpdateBlockQuoteStateFn = (
	params: UpdateBlockQuoteStateParams,
) => void;

// CodeBlock
export interface UpdateCodeBlockStateParams
	extends CodeBlockToolbarButtonState {}

export type UpdateCodeBlockStateFn = (
	params: UpdateCodeBlockStateParams,
) => void;

// CustomComponent
export interface UpdateCustomComponentStateParams
	extends CustomComponentToolbarButtonState {}

export type UpdateCustomComponentStateFn = (
	params: UpdateCustomComponentStateParams,
) => void;

// Image
export interface UpdateImageStateParams extends ImageToolbarButtonState {}

export type UpdateImageStateFn = (params: UpdateImageStateParams) => void;

// OrderedList
export interface UpdateOrderedListStateParams
	extends UnorderedListToolbarButtonState {}

export type UpdateOrderedListStateFn = (
	params: UpdateOrderedListStateParams,
) => void;

// Symbols
export interface UpdateSymbolsStateParams extends SymbolsToolbarButtonState {}

export type UpdateSymbolsStateFn = (params: UpdateSymbolsStateParams) => void;

// Table
export interface UpdateTableStateParams extends TableToolbarButtonState {}

export type UpdateTableStateFn = (params: UpdateTableStateParams) => void;

// TemplateVariable
export interface UpdateTemplateVariableStateParams
	extends TemplateVariableToolbarButtonState {}

export type UpdateTemplateVariableStateFn = (
	params: UpdateTemplateVariableStateParams,
) => void;

// UnorderedList
export interface UpdateUnorderedListStateParams
	extends UnorderedListToolbarButtonState {}

export type UpdateUnorderedListStateFn = (
	params: UpdateUnorderedListStateParams,
) => void;

export interface NodeInsertionButtonsState {
	anchor: Partial<AnchorToolbarButtonState>;
	blockQuote: Partial<BlockQuoteToolbarButtonState>;
	checkboxList: Partial<CheckboxListToolbarButtonState>;
	codeBlock: Partial<CodeBlockToolbarButtonState>;
	customComponent: Partial<CustomComponentToolbarButtonState>;
	image: Partial<ImageToolbarButtonState>;
	symbols: Partial<SymbolsToolbarButtonState>;
	orderedList: Partial<OrderedListToolbarButtonState>;
	table: Partial<TableToolbarButtonState>;
	templateVariable: Partial<TemplateVariableToolbarButtonState>;
	unorderedList: Partial<UnorderedListToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
	[toolbarButtonsName.anchor]: UpdateAnchorStateFn;
	[toolbarButtonsName.blockQuote]: UpdateBlockQuoteStateFn;
	[toolbarButtonsName.checkboxList]: UpdateCheckboxListStateFn;
	[toolbarButtonsName.codeBlock]: UpdateCodeBlockStateFn;
	[toolbarButtonsName.customComponent]: UpdateCustomComponentStateFn;
	[toolbarButtonsName.image]: UpdateImageStateFn;
	[toolbarButtonsName.symbols]: UpdateSymbolsStateFn;
	[toolbarButtonsName.orderedList]: UpdateOrderedListStateFn;
	[toolbarButtonsName.table]: UpdateTableStateFn;
	[toolbarButtonsName.templateVariable]: UpdateTemplateVariableStateFn;
	[toolbarButtonsName.unorderedList]: UpdateUnorderedListStateFn;
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
