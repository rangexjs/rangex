import { extendObjectProperties } from "#utilities";
import {
	createCaretMenuPort,
	createEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateTemplateVariableAdapterParams,
	CreateTemplateVariableAdapterResult,
	InsertParams,
	OnCanInsertUpdateCallbackFn,
	OnInsertCallbackFn,
	OnOptionsCallbackFn,
	OnOptionsUpdateCallbackFn,
	OnSelectCallbackFn,
	SuggestionItem,
	SuggestionItems,
	TemplateVariableConfigPort,
	TemplateVariableConfigPortProps,
	TemplateVariableInternals,
	TemplateVariablePublicPort,
	TemplateVariablePublicPortProps,
	UpdateStateParams,
} from "./TemplateVariableAdapter-types";

const ALL_ITEMS: SuggestionItems = [
	{ kind: "full-name", label: "{{FullName}}" },
	{ kind: "first-name", label: "{{FirstName}}" },
	{ kind: "last-name", label: "{{LastName}}" },
	{ kind: "email", label: "{{Email}}" },
	{ kind: "date", label: "{{Date}}" },
];

export const createTemplateVariableAdapter = (
	...params: CreateTemplateVariableAdapterParams
): CreateTemplateVariableAdapterResult => {
	const [_settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("templateVariable");

	const internals: TemplateVariableInternals = {
		// States
		canInsert: false,
		options: { firstName: null, lastName: null, email: null, date: null },
		// Rest
		items: ALL_ITEMS,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const optionsUpdateEmitter = createEmitter<OnOptionsUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const optionsEmitter = createEmitter<OnOptionsCallbackFn>();
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const updateState = ({ canInsert, options }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (options !== undefined) {
			internals.options = options;

			optionsUpdateEmitter.emit(internals.options);
		}
	};

	const unwrapPort = createUnwrapPort();

	const configPort: TemplateVariableConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		{
			get caretMenu() {
				return caretMenuPort.configPort;
			},

			updateState(params) {
				updateState(params);
			},

			onInsert(callback) {
				return insertEmitter.subscribe(callback);
			},

			onOptions(callback) {
				return optionsEmitter.subscribe(callback);
			},

			onSelect(callback) {
				return selectEmitter.subscribe(callback);
			},
		} satisfies TemplateVariableConfigPortProps,
	);

	const publicPort: TemplateVariablePublicPort = extendObjectProperties(
		unwrapPort.publicPort,
		{
			get caretMenu() {
				return caretMenuPort.publicPort;
			},

			get canInsert() {
				return internals.canInsert;
			},

			get options() {
				return internals.options;
			},

			get items() {
				return internals.items;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onOptionsUpdate(callback) {
				return optionsUpdateEmitter.subscribe(callback);
			},

			insert(params: InsertParams) {
				insertEmitter.emit(params);
			},

			changeOptions(options) {
				optionsEmitter.emit(options);
			},

			select(item: SuggestionItem) {
				selectEmitter.emit(item);
			},
		} satisfies TemplateVariablePublicPortProps,
	);

	return { configPort, publicPort };
};
