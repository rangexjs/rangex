import type { toolbarButtonsName } from "../../Constants";
import type { TextAreaReadabilityToolbarButtonState } from "../../ToolbarButtonProps";

// TextAreaReadability
export interface UpdateTextAreaReadabilityStateParams
	extends TextAreaReadabilityToolbarButtonState {}

export type UpdateTextAreaReadabilityStateFn = (
	props: UpdateTextAreaReadabilityStateParams,
) => void;

export interface NonCategorizedOperationButtonsState {
	textAreaReadability: Partial<TextAreaReadabilityToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
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
