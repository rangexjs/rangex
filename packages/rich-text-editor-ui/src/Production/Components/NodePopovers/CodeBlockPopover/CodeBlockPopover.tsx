import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type {
	UpdateDarkThemeFn,
	UpdateLanguageFn,
	UpdateLightThemeFn,
} from "../../../PopoverControllers";
import {
	useEditorOptionsContext,
	usePopoverControllersContext,
} from "../../App";
import { Icon } from "../../Icon";
import { OptionDropdown } from "../_Utilities";

export const CodeBlockPopover = () => {
	const { codeBlockLanguages, codeBlockThemes } = useEditorOptionsContext();
	const { codeBlockPopoverController: controller } =
		usePopoverControllersContext();

	const languageOptions = codeBlockLanguages.map((language) => ({
		label: language,
		value: language,
	}));

	const themeOptions = codeBlockThemes.map((theme) => ({
		label: theme,
		value: theme,
	}));

	const [language, setLanguage] = createSignal(controller.language);
	const [lightTheme, setLightTheme] = createSignal(controller.lightTheme);
	const [darkTheme, setDarkTheme] = createSignal(controller.darkTheme);
	const [copied, setCopied] = createSignal(false);

	const optionsPopoverId = createUniqueId();

	let optionsPopover: HTMLDivElement | undefined;

	onMount(() => {
		const onLanguage: UpdateLanguageFn = (value) => setLanguage(value);
		const onLightTheme: UpdateLightThemeFn = (value) => setLightTheme(value);
		const onDarkTheme: UpdateDarkThemeFn = (value) => setDarkTheme(value);

		controller.subscribe({ type: "language", callback: onLanguage });
		controller.subscribe({ type: "lightTheme", callback: onLightTheme });
		controller.subscribe({ type: "darkTheme", callback: onDarkTheme });

		onCleanup(() => {
			controller.unsubscribe({ type: "language", callback: onLanguage });
			controller.unsubscribe({ type: "lightTheme", callback: onLightTheme });
			controller.unsubscribe({ type: "darkTheme", callback: onDarkTheme });
		});
	});

	const onBeforeToggle = () => {
		if (!optionsPopover) {
			throw new Error("OptionsPopover shouldn't be undefined.");
		}

		if (optionsPopover.matches(":popover-open")) {
			optionsPopover.hidePopover();
		}
	};

	const onCopyClick = (() => {
		let timeoutId = NaN;
		return () => {
			controller.emitCopy();
			setCopied(true);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setCopied(false), 1200);
		};
	})();

	return (
		<div
			ref={(el) => controller.setPopover(el)}
			popover="manual"
			class="items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs open:flex dark:border-neutral-700 dark:bg-neutral-900"
			on:beforetoggle={onBeforeToggle}
		>
			<button
				type="button"
				class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
				title="Copy"
				on:click={onCopyClick}
			>
				<Icon name={copied() ? "Check" : "CopySimple"} class="size-4" />
			</button>

			<button
				type="button"
				commandfor={optionsPopoverId}
				command="toggle-popover"
				class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
				title="Options"
			>
				<Icon name="DotsThreeHorizontal" class="size-4" />
			</button>

			<div
				ref={optionsPopover}
				id={optionsPopoverId}
				popover="auto"
				class="w-32 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
			>
				<OptionDropdown
					label="Language"
					value={language()}
					options={languageOptions}
					onSelect={(lang) => controller.emitLanguageChange(lang)}
				/>
				<OptionDropdown
					label="☀ Light"
					value={lightTheme()}
					options={themeOptions}
					onSelect={(theme) => controller.emitLightThemeChange(theme)}
					class="flex-1"
				/>
				<OptionDropdown
					label="☾ Dark"
					value={darkTheme()}
					options={themeOptions}
					onSelect={(theme) => controller.emitDarkThemeChange(theme)}
					class="flex-1"
				/>
			</div>
		</div>
	);
};
