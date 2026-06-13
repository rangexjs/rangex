import type {
	EmitMenuBarChangeParams,
	OnMenuBarFn,
} from "./MenuBarActionManager-types";

export class MenuBarActionManager {
	#listeners: Set<OnMenuBarFn> = new Set();

	subscribe(callback: OnMenuBarFn) {
		this.#listeners.add(callback);
	}

	unsubscribe(callback: OnMenuBarFn) {
		this.#listeners.delete(callback);
	}

	emitMenuBarChange(params: EmitMenuBarChangeParams) {
		for (const listener of this.#listeners) {
			listener(params);
		}
	}
}
