import type {
	ToolbarButtonValue,
	toolbarButtonActionsName,
	toolbarButtonsName,
} from "../Constants";
import type {
	CustomComponentName,
	FindReplacePattern,
} from "../ToolbarButtonProps";

interface GetButtonType<Type extends ToolbarButtonValue> {
	type: Type;
}

// NodeInsertion
export interface AnchorActionState
	extends GetButtonType<typeof toolbarButtonsName.anchor> {}

export interface CustomComponentActionState
	extends GetButtonType<typeof toolbarButtonsName.customComponent> {
	name: CustomComponentName;
}

export interface MediaActionState
	extends GetButtonType<typeof toolbarButtonsName.media> {}

export type NodeInsertionActionState =
	| AnchorActionState
	| CustomComponentActionState
	| MediaActionState;

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
