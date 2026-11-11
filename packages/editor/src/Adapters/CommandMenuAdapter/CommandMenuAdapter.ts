import { extendObjectProperties } from "#utilities";

import { createCaretMenuPort, createEmitter, createStateEmitter } from "../_Utilities";
import type {
	CommandMenuAvailableItems,
	CommandMenuConfigPort,
	CommandMenuConfigPortProps,
	CommandMenuItemValue,
	CommandMenuPublicPort,
	CommandMenuPublicPortProps,
	CreateCommandMenuAdapterParams,
	CreateCommandMenuAdapterResult,
	OnBeforeSelectCallbackFn,
	UpdateStateParams,
} from "./CommandMenuAdapter-types";

/*
 * Every item the command menu can offer, in the order it lists them. Which ones are available at the selection is
 * the availableItems state.
 */
export const commandMenuItemValues: CommandMenuItemValue[] = [
	"p",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6",
	"unordered-list",
	"ordered-list",
	"todo-list",
	"block-quote",
	"code-block",
	"table",
	"media",
	"accordion-item",
	"separator",
];

export const createCommandMenuAdapter = (
	...params: CreateCommandMenuAdapterParams
): CreateCommandMenuAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("commandMenu");

	// States
	const availableItemsState = createStateEmitter<CommandMenuAvailableItems>([]);

	// CommandListeners
	const beforeSelectEmitter = createEmitter<OnBeforeSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const updateState = ({ availableItems }: UpdateStateParams) => {
		if (availableItems !== undefined) {
			availableItemsState.set(availableItems);
		}
	};

	const configPort: CommandMenuConfigPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.configPort;
		},

		updateState(params) {
			updateState(params);
		},

		onBeforeSelect(callback) {
			return beforeSelectEmitter.subscribe(callback);
		},
	} satisfies CommandMenuConfigPortProps);

	const publicPort: CommandMenuPublicPort = extendObjectProperties({}, {
		get caretMenu() {
			return caretMenuPort.publicPort;
		},

		get availableItems() {
			return availableItemsState.get();
		},

		onAvailableItemsUpdate(callback) {
			return availableItemsState.subscribe(callback);
		},

		beforeSelect() {
			beforeSelectEmitter.emit();
		},
	} satisfies CommandMenuPublicPortProps);

	return { configPort, publicPort };
};
