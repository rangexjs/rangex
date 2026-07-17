import type { toolbarButtonsName } from "../../Constants";
import type {
	HistoryBackToolbarButtonState,
	HistoryForwardToolbarButtonState,
} from "../../ToolbarButtonProps";

// HistoryBack
export interface UpdateHistoryBackStateParams
	extends HistoryBackToolbarButtonState {}

export type UpdateHistoryBackStateFn = (
	params: UpdateHistoryBackStateParams,
) => void;

// HistoryForward
export interface UpdateHistoryForwardStateParams
	extends HistoryForwardToolbarButtonState {}

export type UpdateHistoryForwardStateFn = (
	params: UpdateHistoryForwardStateParams,
) => void;

export interface HistoryNavigationButtonsState {
	historyBack: Partial<HistoryBackToolbarButtonState>;
	historyForward: Partial<HistoryForwardToolbarButtonState>;
}

export type StateChangeFn = () => void;

export type ListenerMap = {
	[toolbarButtonsName.historyBack]: UpdateHistoryBackStateFn;
	[toolbarButtonsName.historyForward]: UpdateHistoryForwardStateFn;
	statechange: () => void;
};

export type ListenerOption = {
	[Key in keyof ListenerMap]: { type: Key; callback: ListenerMap[Key] };
}[keyof ListenerMap];

export type UpdateListenerParams = ListenerOption & {
	operation: "add" | "delete";
};

export interface UpdateHistoryNavigationButtonsStateParams
	extends Partial<HistoryNavigationButtonsState> {}
