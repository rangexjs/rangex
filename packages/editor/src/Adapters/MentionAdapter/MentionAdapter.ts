import { extendObjectProperties } from "#utilities";
import {
	createCaretMenuPort,
	createEmitter,
	createUnwrapPort,
} from "../_Utilities";
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

	const _internals: MentionInternals = {};

	// CommandListeners
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const unwrapPort = createUnwrapPort();

	const configPort: MentionConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		{
			get caretMenu() {
				return caretMenuPort.configPort;
			},

			onSelect(callback) {
				return selectEmitter.subscribe(callback);
			},
		} satisfies MentionConfigPortProps,
	);

	const publicPort: MentionPublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		{
			get caretMenu() {
				return caretMenuPort.publicPort;
			},

			select(params: SelectParams) {
				selectEmitter.emit(params);
			},
		} satisfies MentionPublicPortProps,
	);

	return { configPort, publicPort };
};
