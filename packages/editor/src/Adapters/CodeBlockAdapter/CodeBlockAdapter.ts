import type { BlockComponent } from "@rangex/core";
import { extendObjectProperties } from "#utilities";
import {
	createCurrentComponentPort,
	createEmitter,
	createQuickActionsPort,
	createRemovePort,
	createUnwrapPort,
} from "../_Utilities";
import type {
	CodeBlockConfigPort,
	CodeBlockConfigPortProps,
	CodeBlockInternals,
	CodeBlockPublicPort,
	CodeBlockPublicPortProps,
	CreateCodeBlockAdapterParams,
	CreateCodeBlockAdapterResult,
	OnCanInsertUpdateCallbackFn,
	OnCanWrapUpdateCallbackFn,
	OnChangeLanguageCallbackFn,
	OnChangeThemeCallbackFn,
	OnInsertCallbackFn,
	OnLanguageUpdateCallbackFn,
	OnThemeUpdateCallbackFn,
	OnWrapCallbackFn,
	UpdateStateParams,
} from "./CodeBlockAdapter-types";

export const createCodeBlockAdapter = (
	...params: CreateCodeBlockAdapterParams
): CreateCodeBlockAdapterResult => {
	const [settings, { adapterBus, floatingContainer }] = params;

	adapterBus.registerAdapter("codeBlock");

	const internals: CodeBlockInternals = {
		// States
		canInsert: false,
		canWrap: false,
		language: null,
		theme: null,
		// Providers
		plainTextProvider: null,
		// Rest
		getHighlightInfo: settings.getHighlightInfo ?? null,
	};

	// StateListeners
	const canInsertUpdateEmitter = createEmitter<OnCanInsertUpdateCallbackFn>();
	const canWrapUpdateEmitter = createEmitter<OnCanWrapUpdateCallbackFn>();
	const languageUpdateEmitter = createEmitter<OnLanguageUpdateCallbackFn>();
	const themeUpdateEmitter = createEmitter<OnThemeUpdateCallbackFn>();

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
			internals.canInsert = canInsert;

			canInsertUpdateEmitter.emit(internals.canInsert);
		}

		if (canWrap !== undefined) {
			internals.canWrap = canWrap;

			canWrapUpdateEmitter.emit(internals.canWrap);
		}

		if (language !== undefined) {
			internals.language = language;

			languageUpdateEmitter.emit(internals.language);
		}

		if (theme !== undefined) {
			internals.theme = theme;

			themeUpdateEmitter.emit(internals.theme);
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
				return internals.canInsert;
			},

			get canWrap() {
				return internals.canWrap;
			},

			get language() {
				return internals.language;
			},

			get theme() {
				return internals.theme;
			},

			onCanInsertUpdate(callback) {
				return canInsertUpdateEmitter.subscribe(callback);
			},

			onCanWrapUpdate(callback) {
				return canWrapUpdateEmitter.subscribe(callback);
			},

			onLanguageUpdate(callback) {
				return languageUpdateEmitter.subscribe(callback);
			},

			onThemeUpdate(callback) {
				return themeUpdateEmitter.subscribe(callback);
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
		} satisfies CodeBlockPublicPortProps,
	);

	return { configPort, publicPort };
};
