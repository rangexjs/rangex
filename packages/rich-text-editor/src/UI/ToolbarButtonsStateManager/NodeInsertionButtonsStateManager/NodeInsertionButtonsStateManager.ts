import { toolbarButtonsName } from "../../Constants";
import { assertNever } from "../../ErrorHandling";
import type {
	AnchorToolbarButtonState,
	CustomComponentToolbarButtonState,
	MediaToolbarButtonState,
} from "../../ToolbarButtonProps";
import type {
	ListenerOption,
	StateChangeFn,
	UpdateAnchorStateFn,
	UpdateCustomComponentStateFn,
	UpdateListenerParams,
	UpdateMediaStateFn,
	UpdateNodeInsertionButtonsStateParams,
} from "./NodeInsertionButtonsStateManager-types";

export class NodeInsertionButtonsStateManager {
	#anchor: AnchorToolbarButtonState = { disabled: true, checked: false };
	#customComponent: CustomComponentToolbarButtonState = { disabled: true };
	#media: MediaToolbarButtonState = { disabled: true };

	#anchorListeners: Set<UpdateAnchorStateFn> = new Set();
	#customComponentListeners: Set<UpdateCustomComponentStateFn> = new Set();
	#mediaListeners: Set<UpdateMediaStateFn> = new Set();
	#stateChangeListeners: Set<StateChangeFn> = new Set();

	get anchor() {
		return this.#anchor;
	}

	get customComponent() {
		return this.#customComponent;
	}

	get media() {
		return this.#media;
	}

	#updateListener({ type, callback, operation }: UpdateListenerParams) {
		if (type === toolbarButtonsName.anchor) {
			this.#anchorListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.customComponent) {
			this.#customComponentListeners[operation](callback);
			return;
		}

		if (type === toolbarButtonsName.media) {
			this.#mediaListeners[operation](callback);
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
		anchor,
		customComponent,
		media,
	}: UpdateNodeInsertionButtonsStateParams) {
		if (anchor) {
			this.#anchor = { ...this.#anchor, ...anchor };

			for (const listener of this.#anchorListeners) {
				listener(this.#anchor);
			}
		}

		if (customComponent) {
			this.#customComponent = { ...this.#customComponent, ...customComponent };

			for (const listener of this.#customComponentListeners) {
				listener(this.#customComponent);
			}
		}

		if (media) {
			this.#media = { ...this.#media, ...media };

			for (const listener of this.#mediaListeners) {
				listener(this.#media);
			}
		}

		for (const listener of this.#stateChangeListeners) {
			listener();
		}
	}
}
