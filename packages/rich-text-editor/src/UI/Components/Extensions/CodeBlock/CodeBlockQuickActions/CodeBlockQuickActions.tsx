import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { CodeBlockUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { OptionDropdown } from "../../_Utilities";

interface CodeBlockQuickActionsProps {
	uiPort: CodeBlockUIPort;
}

export const CodeBlockQuickActions = (props: CodeBlockQuickActionsProps) => {
	const uiPort = props.uiPort;

	const languageOptions = uiPort.languages.map((language) => ({
		label: language,
		value: language,
	}));

	const themeOptions = uiPort.themes.map((theme) => ({
		label: theme,
		value: theme,
	}));

	const [language, setLanguage] = createSignal(uiPort.language);
	const [lightTheme, setLightTheme] = createSignal(uiPort.lightTheme);
	const [darkTheme, setDarkTheme] = createSignal(uiPort.darkTheme);
	const [copied, setCopied] = createSignal(false);

	const optionsPopoverId = createUniqueId();

	let optionsPopover: HTMLDivElement | undefined;

	const closeNestedPopovers = () => {
		if (!optionsPopover) {
			throw new Error("OptionsPopover shouldn't be undefined.");
		}

		if (optionsPopover.matches(":popover-open")) {
			optionsPopover.hidePopover();
		}
	};

	onMount(() => {
		const unsubscribeLanguage = uiPort.onLanguageUpdate(setLanguage);
		const unsubscribeLightTheme = uiPort.onLightThemeUpdate(setLightTheme);
		const unsubscribeDarkTheme = uiPort.onDarkThemeUpdate(setDarkTheme);
		const unsubscribeIsOpen = uiPort.onIsOpenUpdate(closeNestedPopovers);

		onCleanup(() => {
			unsubscribeLanguage();
			unsubscribeLightTheme();
			unsubscribeDarkTheme();
			unsubscribeIsOpen();
		});
	});

	const onCopyClick = (() => {
		let timeoutId = NaN;
		return () => {
			uiPort.emitCopy();
			setCopied(true);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setCopied(false), 1200);
		};
	})();

	return (
		<div
			ref={(el) => uiPort.anchoredOverlay.setElement(el)}
			class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900"
		>
			<button
				type="button"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				title="Copy"
				on:click={onCopyClick}
			>
				<Icon name={copied() ? "Check" : "CopySimple"} class="size-4" />
			</button>

			<button
				type="button"
				commandfor={optionsPopoverId}
				command="toggle-popover"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				title="Options"
			>
				<Icon name="DotsThreeHorizontal" class="size-4" />
			</button>

			<div
				ref={(el) => {
					optionsPopover = el;
				}}
				id={optionsPopoverId}
				popover="auto"
				class="w-32 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
			>
				<OptionDropdown
					label="Language"
					value={language()}
					options={languageOptions}
					onSelect={(lang) => uiPort.emitLanguageChange(lang)}
				/>
				<OptionDropdown
					label="☀ Light"
					value={lightTheme()}
					options={themeOptions}
					onSelect={(theme) => uiPort.emitLightThemeChange(theme)}
					class="flex-1"
				/>
				<OptionDropdown
					label="☾ Dark"
					value={darkTheme()}
					options={themeOptions}
					onSelect={(theme) => uiPort.emitDarkThemeChange(theme)}
					class="flex-1"
				/>
			</div>
		</div>
	);
};
