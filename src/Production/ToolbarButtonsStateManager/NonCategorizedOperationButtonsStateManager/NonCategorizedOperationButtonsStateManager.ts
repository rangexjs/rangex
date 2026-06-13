import { toolbarButtonsName } from "../../Constants";
import { assertNever } from "../../ErrorHandling";
import type {
	FindReplaceToolbarButtonState,
	TextAreaReadabilityToolbarButtonState,
} from "../../ToolbarButtonProps";
import type {
	ListenerOption,
	StateChangeFn,
	UpdateFindReplaceStateFn,
	UpdateListenerParams,
	UpdateNonCategorizedOperationButtonsStateParams,
	UpdateTextAreaReadabilityStateFn,
} from "./NonCategorizedOperationButtonsStateManager-types";

export class NonCategorizedOperationButtonsStateManager {
	#findReplace: FindReplaceToolbarButtonState = {
		totalResults: 0,
		currentIndex: 0,
		results: [],
	};
	#textAreaReadability: TextAreaReadabilityToolbarButtonState = {
		checked: false,
	};

	#findReplaceListeners: Set<UpdateFindReplaceStateFn> = new Set();
	#textAreaReadabilityListeners: Set<UpdateTextAreaReadabilityStateFn> =
		new Set();
	#stateChangeListeners: Set<StateChangeFn> = new Set();

	get findReplace() {
		return this.#findReplace;
	}

	get textAreaReadability() {
		return this.#textAreaReadability;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === toolbarButtonsName.findReplace) {
			this.#findReplaceListeners[operation](callback);
			return;
		}

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
		findReplace,
		textAreaReadability,
	}: UpdateNonCategorizedOperationButtonsStateParams) {
		if (findReplace) {
			this.#findReplace = { ...this.#findReplace, ...findReplace };

			for (const listener of this.#findReplaceListeners) {
				listener(this.#findReplace);
			}
		}

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
