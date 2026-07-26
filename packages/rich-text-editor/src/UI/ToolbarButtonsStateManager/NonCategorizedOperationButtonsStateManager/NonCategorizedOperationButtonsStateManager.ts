import { toolbarButtonsName } from "../../Constants";
import { assertNever } from "../../ErrorHandling";
import type { TextAreaReadabilityToolbarButtonState } from "../../ToolbarButtonProps";
import type {
	ListenerOption,
	StateChangeFn,
	UpdateListenerParams,
	UpdateNonCategorizedOperationButtonsStateParams,
	UpdateTextAreaReadabilityStateFn,
} from "./NonCategorizedOperationButtonsStateManager-types";

export class NonCategorizedOperationButtonsStateManager {
	#textAreaReadability: TextAreaReadabilityToolbarButtonState = {
		checked: false,
	};

	#textAreaReadabilityListeners: Set<UpdateTextAreaReadabilityStateFn> =
		new Set();
	#stateChangeListeners: Set<StateChangeFn> = new Set();

	get textAreaReadability() {
		return this.#textAreaReadability;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === toolbarButtonsName.textAreaReadability) {
			this.#textAreaReadabilityListeners[operation](callback);
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
		textAreaReadability,
	}: UpdateNonCategorizedOperationButtonsStateParams) {
		if (textAreaReadability) {
			this.#textAreaReadability = {
				...this.#textAreaReadability,
				...textAreaReadability,
			};

			for (const listener of this.#textAreaReadabilityListeners) {
				listener(this.#textAreaReadability);
			}
		}

		for (const listener of this.#stateChangeListeners) {
			listener();
		}
	}
}
