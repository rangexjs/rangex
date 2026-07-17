import type { toolbarButtonsName } from "../../Constants";
import type {
	FindReplaceToolbarButtonState,
	TextAreaReadabilityToolbarButtonState,
} from "../../ToolbarButtonProps";

// FindReplace
export interface UpdateFindReplaceStateParams
	extends FindReplaceToolbarButtonState {}

export type UpdateFindReplaceStateFn = (
	params: UpdateFindReplaceStateParams,
) => void;

// TextAreaReadability
export interface UpdateTextAreaReadabilityStateParams
	extends TextAreaReadabilityToolbarButtonState {}

export type UpdateTextAreaReadabilityStateFn = (
	props: UpdateTextAreaReadabilityStateParams,
) => void;

export interface NonCategorizedOperationButtonsState {
	findReplace: Partial<FindReplaceToolbarButtonState>;
	textAreaReadability: Partial<TextAreaReadabilityToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
	[toolbarButtonsName.findReplace]: UpdateFindReplaceStateFn;
	[toolbarButtonsName.textAreaReadability]: UpdateTextAreaReadabilityStateFn;
	statechange: () => void;
};

export type ListenerOption = {
	[Key in keyof ListenerMap]: { type: Key; callback: ListenerMap[Key] };
}[keyof ListenerMap];

export type UpdateListenerParams = ListenerOption & {
	operation: "add" | "delete";
};

export interface UpdateNonCategorizedOperationButtonsStateParams
	extends Partial<NonCategorizedOperationButtonsState> {}
