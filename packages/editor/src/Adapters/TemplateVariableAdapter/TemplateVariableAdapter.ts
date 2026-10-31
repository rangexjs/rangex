import { extendObjectProperties } from "#utilities";
import {
	createCaretMenuPort,
	createEmitter,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CreateTemplateVariableAdapterParams,
	CreateTemplateVariableAdapterResult,
	InsertParams,
	OnChangeFieldsCallbackFn,
	OnInsertCallbackFn,
	OnSelectCallbackFn,
	TemplateVariableConfigPort,
	TemplateVariableConfigPortProps,
	TemplateVariableFields,
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
		// Settings
		fieldsConfig: settings.fieldsConfig,
		// Rest
		items: Object.keys(settings.fieldsConfig).map((fieldName) => ({
			fieldName,
		})),
		// Providers
		validateFieldNameProvider: null,
		validateFieldValueProvider: null,
	};

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const fieldsState = createStateEmitter<TemplateVariableFields>({});

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const changeFieldsEmitter = createEmitter<OnChangeFieldsCallbackFn>();
	const selectEmitter = createEmitter<OnSelectCallbackFn>();

	const caretMenuPort = createCaretMenuPort({ floatingContainer });

	const updateState = ({ canInsert, fields }: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}

		if (fields !== undefined) {
			fieldsState.set(fields);
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

			registerValidateFieldName(provider) {
				internals.validateFieldNameProvider = provider;
			},

			registerValidateFieldValue(provider) {
				internals.validateFieldValueProvider = provider;
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
				return canInsertState.get();
			},

			get fields() {
				return fieldsState.get();
			},

			get fieldsConfig() {
				return internals.fieldsConfig;
			},

			get items() {
				return internals.items;
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onFieldsUpdate(callback) {
				return fieldsState.subscribe(callback);
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

			validateFieldName(fieldName) {
				if (!internals.validateFieldNameProvider) {
					throw new Error("ValidateFieldName provider wasn't registered.");
				}

				return internals.validateFieldNameProvider(fieldName);
			},

			validateFieldValue(value) {
				if (!internals.validateFieldValueProvider) {
					throw new Error("ValidateFieldValue provider wasn't registered.");
				}

				return internals.validateFieldValueProvider(value);
			},
		} satisfies TemplateVariablePublicPortProps,
	);

	return { configPort, publicPort };
};
