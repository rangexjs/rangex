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
	OnChangeFieldsCallbackFn,
	OnFieldsUpdateCallbackFn,
	OnInsertCallbackFn,
	OnSelectCallbackFn,
	TemplateVariableConfigPort,
	TemplateVariableConfigPortProps,
	TemplateVariableInternals,
	TemplateVariableItem,
	TemplateVariablePublicPort,
	TemplateVariablePublicPortProps,
	UpdateStateParams,
} from "./TemplateVariableAdapter-types";

export const createTemplateVariableAdapter = (
	...params: CreateTemplateVariableAdapterParams
): CreateTemplateVariableAdapterResult => {
	const [settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("templateVariable");

	const internals: TemplateVariableInternals = {
		// States
		canInsert: false,
		fields: {},
		// Settings
		fieldsConfig: settings.fieldsConfig,
		// Rest
		items: Object.keys(settings.fieldsConfig).map((fieldName) => ({
			fieldName,
		})),
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const fieldsUpdateEmitter = createEmitter<OnFieldsUpdateCallbackFn>();

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const changeFieldsEmitter = createEmitter<OnChangeFieldsCallbackFn>();
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const updateState = ({ canInsert, fields }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (fields !== undefined) {
			internals.fields = fields;

			fieldsUpdateEmitter.emit(internals.fields);
		}
	};

	const unwrapPort = createUnwrapPort();

	const configPort: TemplateVariableConfigPort = extendObjectProperties(
		unwrapPort.configPort,
		{
			get caretMenu() {
				return caretMenuPort.configPort;
			},

			get fieldsConfig() {
				return internals.fieldsConfig;
			},

			updateState(params) {
				updateState(params);
			},

			onInsert(callback) {
				return insertEmitter.subscribe(callback);
			},

			onChangeFields(callback) {
				return changeFieldsEmitter.subscribe(callback);
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

			get fields() {
				return internals.fields;
			},

			get fieldsConfig() {
				return internals.fieldsConfig;
			},

			get items() {
				return internals.items;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onFieldsUpdate(callback) {
				return fieldsUpdateEmitter.subscribe(callback);
			},

			insert(params: InsertParams) {
				insertEmitter.emit(params);
			},

			changeFields(fields) {
				changeFieldsEmitter.emit(fields);
			},

			select(item: TemplateVariableItem) {
				selectEmitter.emit(item);
			},
		} satisfies TemplateVariablePublicPortProps,
	);

	return { configPort, publicPort };
};
