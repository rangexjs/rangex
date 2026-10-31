import type { BlockComponent } from "@rangex/core";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createQuickActionsPort,
	createRemovePort,
	createStateEmitter,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CodeBlockConfigPort,
	CodeBlockConfigPortProps,
	CodeBlockInternals,
	CodeBlockPublicPort,
	CodeBlockPublicPortProps,
	CodeBlockTheme,
	CreateCodeBlockAdapterParams,
	CreateCodeBlockAdapterResult,
	OnChangeLanguageCallbackFn,
	OnChangeThemeCallbackFn,
	OnInsertCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./CodeBlockAdapter-types";

export const createCodeBlockAdapter = (
	...params: CreateCodeBlockAdapterParams
): CreateCodeBlockAdapterResult => {
	const [settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("codeBlock");

	const codeBlockAttrValidators = adapterBus.getAttrValidators("codeBlock");

	const internals: CodeBlockInternals = {
		// Providers
		plainTextProvider: null,
		validateLanguageProvider: null,
		validateThemeProvider: null,
		// Rest
		getHighlightInfo: settings.getHighlightInfo ?? null,
	};

	// States
	const canInsertState = createStateEmitter<boolean>(false);
	const canWrapState = createStateEmitter<boolean>(false);
	const languageState = createStateEmitter<string | null>(null);
	const themeState = createStateEmitter<CodeBlockTheme | null>(null);

	// CommandListeners
	const insertEmitter = createEmitter<OnInsertCallbackFn>();
	const wrapEmitter = createEmitter<OnWrapCallbackFn>();
	const changeLanguageEmitter = createEmitter<OnChangeLanguageCallbackFn>();
	const changeThemeEmitter = createEmitter<OnChangeThemeCallbackFn>();

	const removePort = createRemovePort();
	const unwrapPort = createUnwrapPort();
	const currentComponentPort = createCurrentComponentPort<BlockComponent>();
	const quickActionsPort = createQuickActionsPort({ floatingContainer });

	const updateState = ({
		canInsert,
		canWrap,
		language,
		theme,
	}: UpdateStateParams) => {
		if (canInsert !== undefined) {
			canInsertState.set(canInsert);
		}

		if (canWrap !== undefined) {
			canWrapState.set(canWrap);
		}

		if (language !== undefined) {
			languageState.set(language);
		}

		if (theme !== undefined) {
			themeState.set(theme);
		}
	};

	const configPort: CodeBlockConfigPort = extendObjectProperties(
		removePort.configPort,
		unwrapPort.configPort,
		currentComponentPort.configPort,
		{
			get quickActions() {
				return quickActionsPort.configPort;
			},

			get getHighlightInfo() {
				return internals.getHighlightInfo;
			},

			get attrValidators() {
				return codeBlockAttrValidators;
			},

			updateState(params) {
				updateState(params);
			},

			onInsert(callback) {
				return insertEmitter.subscribe(callback);
			},

			onWrap(callback) {
				return wrapEmitter.subscribe(callback);
			},

			onChangeLanguage(callback) {
				return changeLanguageEmitter.subscribe(callback);
			},

			onChangeTheme(callback) {
				return changeThemeEmitter.subscribe(callback);
			},

			registerPlainTextProvider(provider) {
				internals.plainTextProvider = provider;
			},

			registerValidateLanguage(provider) {
				internals.validateLanguageProvider = provider;
			},

			registerValidateTheme(provider) {
				internals.validateThemeProvider = provider;
			},
		} satisfies CodeBlockConfigPortProps,
	);

	const publicPort: CodeBlockPublicPort = extendObjectProperties(
		removePort.publicPort,
		unwrapPort.publicPort,
		currentComponentPort.publicPort,
		{
			get quickActions() {
				return quickActionsPort.publicPort;
			},

			get canHighlight() {
				return internals.getHighlightInfo !== null;
			},

			get canInsert() {
				return canInsertState.get();
			},

			get canWrap() {
				return canWrapState.get();
			},

			get language() {
				return languageState.get();
			},

			get theme() {
				return themeState.get();
			},

			onCanInsertUpdate(callback) {
				return canInsertState.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapState.subscribe(callback);
			},

			onLanguageUpdate(callback) {
				return languageState.subscribe(callback);
			},

			onThemeUpdate(callback) {
				return themeState.subscribe(callback);
			},

			insert(params) {
				insertEmitter.emit(params);
			},

			wrap(params) {
				wrapEmitter.emit(params);
			},

			changeLanguage(language) {
				changeLanguageEmitter.emit(language);
			},

			changeTheme(theme) {
				changeThemeEmitter.emit(theme);
			},

			getPlainText() {
				if (!internals.plainTextProvider) {
					throw new Error("Plain text provider wasn't registered.");
				}

				return internals.plainTextProvider();
			},

			validateLanguage(language) {
				if (!internals.validateLanguageProvider) {
					throw new Error("ValidateLanguage provider wasn't registered.");
				}

				return internals.validateLanguageProvider(language);
			},

			validateTheme(theme) {
				if (!internals.validateThemeProvider) {
					throw new Error("ValidateTheme provider wasn't registered.");
				}

				return internals.validateThemeProvider(theme);
			},
		} satisfies CodeBlockPublicPortProps,
	);

	return { configPort, publicPort };
};
