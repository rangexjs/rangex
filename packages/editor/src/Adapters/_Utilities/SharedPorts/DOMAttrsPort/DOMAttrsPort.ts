import type { ComponentAttrs, ComponentAttrsShape } from "#dom-attrs";

import { createStateEmitter } from "../../CreateStateEmitter";
import type {
	CreateDOMAttrsPortResult,
	DOMAttrsConfigPort,
	DOMAttrsInternals,
	DOMAttrsPublicPort,
} from "./DOMAttrsPort-types";

/*
 * Holds the current component's attributes, and passes validateDOMAttrs and changeDOMAttrs to the providers registered by
 * the configure phase (see handleDOMAttrs), as they need the editor to validate and write.
 */
export const createDOMAttrsPort = <
	TShape extends ComponentAttrsShape,
>(): CreateDOMAttrsPortResult<TShape> => {
	const internals: DOMAttrsInternals<TShape> = {
		// Providers
		validateDOMAttrsProvider: null,
		changeDOMAttrsProvider: null,
	};

	// States
	const domAttrsState = createStateEmitter<ComponentAttrs<TShape> | null>(null);

	const configPort: DOMAttrsConfigPort<TShape> = {
		get domAttrs() {
			return domAttrsState.get();
		},

		updateDOMAttrs(domAttrs) {
			domAttrsState.set(domAttrs);
		},

		registerValidateDOMAttrs(provider) {
			internals.validateDOMAttrsProvider = provider;
		},

		registerChangeDOMAttrs(provider) {
			internals.changeDOMAttrsProvider = provider;
		},
	};

	const publicPort: DOMAttrsPublicPort<TShape> = {
		get domAttrs() {
			return domAttrsState.get();
		},

		onDOMAttrsUpdate(callback) {
			return domAttrsState.subscribe(callback);
		},

		validateDOMAttrs(patch) {
			if (!internals.validateDOMAttrsProvider) {
				throw new Error("ValidateDOMAttrs provider wasn't registered.");
			}

			return internals.validateDOMAttrsProvider(patch);
		},

		changeDOMAttrs(patch) {
			if (!internals.changeDOMAttrsProvider) {
				throw new Error("ChangeDOMAttrs provider wasn't registered.");
			}

			return internals.changeDOMAttrsProvider(patch);
		},
	};

	return { configPort, publicPort };
};
