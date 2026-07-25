import type { TemplateVariableKind } from "#ports";
import type {
	ToolbarButtonValue,
	toolbarButtonActionsName,
	toolbarButtonsName,
} from "../Constants";
import type {
	CustomComponentName,
	FindReplacePattern,
	TemplateVariableOptions,
} from "../ToolbarButtonProps";

interface GetButtonType<Type extends ToolbarButtonValue> {
	type: Type;
}

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

export interface CustomComponentActionState
	extends GetButtonType<typeof toolbarButtonsName.customComponent> {
	name: CustomComponentName;
}

export interface MediaActionState
	extends GetButtonType<typeof toolbarButtonsName.media> {}

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
	| CustomComponentActionState
	| MediaActionState
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
