import type {
	ToolbarButtonValue,
	toolbarButtonActionsName,
	toolbarButtonsName,
} from "../Constants";
import type {
	BackgroundColorValue,
	CodeBlockLanguage,
	ColorValue,
	CustomComponentName,
	FindReplacePattern,
	FontFamilyValue,
	FontSizeValue,
	IndentationValue,
	LetterSpacingValue,
	LineHeightValue,
	LineLocalNameValue,
	LineSpacingValue,
	TemplateVariableKind,
	TemplateVariableOptions,
	TextAlignValue,
	ToggleButtonPressed,
} from "../ToolbarButtonProps";

// FormatStyles
export interface FormatStylesActionState {
	backgroundColor?: BackgroundColorValue | null;
	bold?: ToggleButtonPressed;
	code?: ToggleButtonPressed;
	color?: ColorValue | null;
	fontFamily?: FontFamilyValue | null;
	fontSize?: FontSizeValue | null;
	indentation?: IndentationValue;
	italic?: ToggleButtonPressed;
	letterSpacing?: LetterSpacingValue | null;
	lineHeight?: LineHeightValue;
	lineLocalName?: LineLocalNameValue;
	lineSpacing?: LineSpacingValue;
	subscript?: ToggleButtonPressed;
	superscript?: ToggleButtonPressed;
	strikethrough?: ToggleButtonPressed;
	textAlign?: TextAlignValue;
	underline?: ToggleButtonPressed;
}

interface GetButtonType<Type extends ToolbarButtonValue> {
	type: Type;
}

export interface OnFormatStylesParams extends FormatStylesActionState {}

export type OnFormatStylesFn = (params: OnFormatStylesParams) => void;

export interface EmitFormatStylesChangeParams extends FormatStylesActionState {}

// HistoryNavigation
export interface HistoryNavigationActionState {
	type: "history-back" | "history-forward";
}

export interface OnHistoryNavigationParams
	extends HistoryNavigationActionState {}

export type OnHistoryNavigationFn = (params: OnHistoryNavigationParams) => void;

export interface EmitHistoryNavigationChangeParams
	extends HistoryNavigationActionState {}

// NodeInsertion
export interface AnchorActionState
	extends GetButtonType<typeof toolbarButtonsName.anchor> {}

export interface BlockQuoteActionState
	extends GetButtonType<typeof toolbarButtonsName.blockQuote> {}

export interface CheckboxListActionState
	extends GetButtonType<typeof toolbarButtonsName.checkboxList> {}

export interface CodeBlockActionState
	extends GetButtonType<typeof toolbarButtonsName.codeBlock> {
	language: CodeBlockLanguage;
}

export interface CustomComponentActionState
	extends GetButtonType<typeof toolbarButtonsName.customComponent> {
	name: CustomComponentName;
}

export interface ImageFileUpload {
	insertionType: "file-upload";
	files: FileList;
}

export interface ImageURL {
	insertionType: "url";
	url: string;
}

export type ImageActionState = GetButtonType<typeof toolbarButtonsName.image> &
	(ImageFileUpload | ImageURL);

export interface OrderedListActionState
	extends GetButtonType<typeof toolbarButtonsName.orderedList> {}

export interface SymbolsActionState
	extends GetButtonType<typeof toolbarButtonsName.symbols> {
	data: string;
}

export interface TableActionState
	extends GetButtonType<typeof toolbarButtonsName.table> {
	column: number;
	row: number;
}

export interface TemplateVariableInsertion {
	action: "insertion";
	kind: TemplateVariableKind;
}

export interface TemplateVariableUpdate {
	action: "update";
	options: Partial<TemplateVariableOptions>;
}

export type TemplateVariableActionState = GetButtonType<
	typeof toolbarButtonsName.templateVariable
> &
	(TemplateVariableInsertion | TemplateVariableUpdate);

export interface UnorderedListActionState
	extends GetButtonType<typeof toolbarButtonsName.unorderedList> {}

export type NodeInsertionActionState =
	| AnchorActionState
	| BlockQuoteActionState
	| CheckboxListActionState
	| CodeBlockActionState
	| CustomComponentActionState
	| ImageActionState
	| OrderedListActionState
	| SymbolsActionState
	| TableActionState
	| TemplateVariableActionState
	| UnorderedListActionState;

export type OnNodeInsertionFnProps = NodeInsertionActionState;

export type OnNodeInsertionFn = (props: OnNodeInsertionFnProps) => void;

export type EmitNodeInsertionChangeParams = NodeInsertionActionState;

// NonCategorizedOperation
export type FindReplaceActionType =
	| "popover-open"
	| "popover-closed"
	| "search-change"
	| "previous"
	| "next"
	| "navigate-to-index"
	| "replace"
	| "replace-all";

export interface FindReplaceActionState
	extends GetButtonType<typeof toolbarButtonsName.findReplace> {
	action: FindReplaceActionType;
	navigateTo: number;
	pattern: FindReplacePattern;
	replaceText: string;
	includeNonEditableContent: boolean;
}

export interface TextAreaReadabilityActionState
	extends GetButtonType<typeof toolbarButtonsName.textAreaReadability> {
	newState: boolean;
}

export type NonCategorizedOperationActionState =
	| FindReplaceActionState
	| TextAreaReadabilityActionState;

type OnNonCategorizedOperationParams = NonCategorizedOperationActionState;

export type OnNonCategorizedOperationFn = (
	params: OnNonCategorizedOperationParams,
) => void;

export type EmitNonCategorizedOperationChangeParams =
	NonCategorizedOperationActionState;

export type ActionListenerMap = {
	[toolbarButtonActionsName.formatStyles]: OnFormatStylesFn;
	[toolbarButtonActionsName.historyNavigation]: OnHistoryNavigationFn;
	[toolbarButtonActionsName.nodeInsertion]: OnNodeInsertionFn;
	[toolbarButtonActionsName.nonCategorizedOperation]: OnNonCategorizedOperationFn;
};

export type ActionListenerOption = {
	[Key in keyof ActionListenerMap]: {
		type: Key;
		callback: ActionListenerMap[Key];
	};
}[keyof ActionListenerMap];

export type UpdateActionListenerParams = ActionListenerOption & {
	operation: "add" | "delete";
};
