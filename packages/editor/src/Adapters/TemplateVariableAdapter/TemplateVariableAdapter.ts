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
	OnFilteredItemsUpdateCallbackFn,
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
	const [_settings, { floatingContainer }] = params;

	const internals: TemplateVariableInternals = {
		// States
		canInsert: false,
		options: { firstName: null, lastName: null, email: null, date: null },
		query: "",
		filteredItems: [],
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const optionsUpdateEmitter = createEmitter<OnOptionsUpdateCallbackFn>();
	const filteredItemsUpdateEmitter =
		createEmitter<OnFilteredItemsUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const optionsEmitter = createEmitter<OnOptionsCallbackFn>();
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const computeFilteredItems = () => {
		const q = internals.query.toLowerCase();
		internals.filteredItems = q
			? ALL_ITEMS.filter((item) => item.label.toLowerCase().includes(q))
			: ALL_ITEMS;

		filteredItemsUpdateEmitter.emit(internals.filteredItems);
	};

	const updateState = ({ canInsert, options, query }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (options !== undefined) {
			internals.options = options;

			optionsUpdateEmitter.emit(internals.options);
		}

		if (query !== undefined) {
			internals.query = query;
			computeFilteredItems();
		}
	};

	const unwrapPort = createUnwrapPort();

	const configPort: TemplateVariableConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		{
			get caretMenu() {
				return caretMenuPort.configPort;
			},

			get filteredItems() {
				return internals.filteredItems;
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

			get filteredItems() {
				return internals.filteredItems;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onOptionsUpdate(callback) {
				return optionsUpdateEmitter.subscribe(callback);
			},

			onFilteredItemsUpdate(callback) {
				return filteredItemsUpdateEmitter.subscribe(callback);
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
