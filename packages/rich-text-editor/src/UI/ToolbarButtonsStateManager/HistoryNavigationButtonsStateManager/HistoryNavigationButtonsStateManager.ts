import { toolbarButtonsName } from "../../Constants";
import { assertNever } from "../../ErrorHandling";
import type {
	HistoryBackToolbarButtonState,
	HistoryForwardToolbarButtonState,
} from "../../ToolbarButtonProps";
import type {
	ListenerOption,
	StateChangeFn,
	UpdateHistoryBackStateFn,
	UpdateHistoryForwardStateFn,
	UpdateHistoryNavigationButtonsStateParams,
	UpdateListenerParams,
} from "./HistoryNavigationButtonsStateManager-types";

export class HistoryNavigationButtonsStateManager {
	#historyBack: HistoryBackToolbarButtonState = { disabled: true };
	#historyBackListeners: Set<UpdateHistoryBackStateFn> = new Set();
	#historyForward: HistoryForwardToolbarButtonState = { disabled: true };
	#historyForwardListeners: Set<UpdateHistoryForwardStateFn> = new Set();
	#stateChangeListeners: Set<StateChangeFn> = new Set();

	get historyBack() {
		return this.#historyBack;
	}

	get historyForward() {
		return this.#historyForward;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === toolbarButtonsName.historyBack) {
			this.#historyBackListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.historyForward) {
			this.#historyForwardListeners[operation](callback);
			return;
		}

		if (type === "statechange") {
			this.#stateChangeListeners[operation](callback);
			return;
		}

		assertNever(type);
	}

	subscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "add" });
	}

	unsubscribe(params: ListenerOption) {
		this.#updateListener({ ...params, operation: "delete" });
	}

	updateState({
		historyBack,
		historyForward,
	}: UpdateHistoryNavigationButtonsStateParams) {
		if (historyBack) {
			this.#historyBack = { ...this.#historyBack, ...historyBack };

			for (const listener of this.#historyBackListeners) {
				listener(this.#historyBack);
			}
		}

		if (historyForward) {
			this.#historyForward = { ...this.#historyForward, ...historyForward };

			for (const listener of this.#historyForwardListeners) {
				listener(this.#historyForward);
			}
		}

		for (const listener of this.#stateChangeListeners) {
			listener();
		}
	}
}
