import { extendObjectProperties } from "#utilities";

import { createCaretMenuPort, createEmitter, createUnwrapPort } from "../_Utilities";
import type {
	CreateMentionAdapterParams,
	CreateMentionAdapterResult,
	MentionConfigPort,
	MentionConfigPortProps,
	MentionInternals,
	MentionPublicPort,
	MentionPublicPortProps,
	OnSelectCallbackFn,
	SelectParams,
} from "./MentionAdapter-types";

export const createMentionAdapter = (
	...params: CreateMentionAdapterParams
): CreateMentionAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("mention");

	const internals: MentionInternals = {
		// Providers
		validateDisplayTextProvider: null,
	};

	// CommandListeners
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const unwrapPort = createUnwrapPort();

	const configPort: MentionConfigPort = extendObjectProperties(unwrapPort.configPort, {
		get caretMenu() {
			return caretMenuPort.configPort;
		},

		onSelect(callback) {
			return selectEmitter.subscribe(callback);
		},

		registerValidateDisplayText(provider) {
			internals.validateDisplayTextProvider = provider;
		},
	} satisfies MentionConfigPortProps);

	const publicPort: MentionPublicPort = extendObjectProperties(unwrapPort.publicPort, {
		get caretMenu() {
			return caretMenuPort.publicPort;
		},

		select(params: SelectParams) {
			selectEmitter.emit(params);
		},

		validateDisplayText(displayText) {
			if (!internals.validateDisplayTextProvider) {
				throw new Error("ValidateDisplayText provider wasn't registered.");
			}

			return internals.validateDisplayTextProvider(displayText);
		},
	} satisfies MentionPublicPortProps);

	return { configPort, publicPort };
};
