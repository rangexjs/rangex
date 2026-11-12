import type { CodeBlockPublicPort } from "@rangex/editor/code-block";
import type { ReactiveCodeBlockPort, ReactiveReadOnlyPort } from "@rangex/solid";
import type { JSX } from "@solidjs/web";
import { createMemo, createUniqueId, onCleanup } from "solid-js";

import type { CodeBlockUIOptions } from "#context";
import { Icon } from "#ui";

import { OptionDropdown } from "../../../_Utilities";

interface LanguageDropdownProps {
	codeBlock: CodeBlockPublicPort;
	$codeBlock: ReactiveCodeBlockPort;
	options: CodeBlockUIOptions;
	class?: JSX.ClassValue;
}

const LanguageDropdown = (props: LanguageDropdownProps) => {
	const languages = createMemo(() => props.options.languages ?? []);

	const languageValue = createMemo(() => props.$codeBlock.language());

	const onSelect = (selected: string | null) => {
		props.codeBlock.changeLanguage(selected);
	};

	return (
		<OptionDropdown<string | null>
			label="Language"
			value={languageValue()}
			notFoundLabel="Unknown"
			options={languages()}
			onSelect={onSelect}
			class={props.class}
		/>
	);
};

interface ThemeDropdownProps {
	codeBlock: CodeBlockPublicPort;
	$codeBlock: ReactiveCodeBlockPort;
	options: CodeBlockUIOptions;
	theme: "light" | "dark";
	class?: JSX.ClassValue;
}

const ThemeDropdown = (props: ThemeDropdownProps) => {
	const themes = createMemo(() => props.options.themes ?? []);

	const themeValue = createMemo(() => props.$codeBlock.theme()?.[props.theme] ?? null);

	const label = { light: "☀ Light", dark: "☾ Dark" }[props.theme];

	const onSelect = (selected: string | null) => {
		if (selected === null) {
			props.codeBlock.changeTheme(null);
			return;
		}

		const currentTheme = props.$codeBlock.theme();
		const currentLight = currentTheme?.light ?? selected;
		const currentDark = currentTheme?.dark ?? selected;

		const light = props.theme === "light" ? selected : currentLight;
		const dark = props.theme === "dark" ? selected : currentDark;

		props.codeBlock.changeTheme({ light, dark });
	};

	return (
		<OptionDropdown<string | null>
			label={label}
			value={themeValue()}
			notFoundLabel="Unknown"
			options={themes()}
			onSelect={onSelect}
			class={props.class}
		/>
	);
};

export interface CodeBlockHighlightProps {
	codeBlock: CodeBlockPublicPort;
	$codeBlock: ReactiveCodeBlockPort;
	readOnly: ReactiveReadOnlyPort | undefined;
	options: CodeBlockUIOptions;
}

export const CodeBlockHighlight = (props: CodeBlockHighlightProps) => {
	const optionsPopoverId = createUniqueId();

	const hasLanguages = createMemo(() => (props.options.languages ?? []).length > 0);
	const hasThemes = createMemo(() => (props.options.themes ?? []).length > 0);
	const hasOptions = createMemo(() => hasLanguages() || hasThemes());

	let optionsPopover: HTMLDivElement | undefined;

	const closeNestedPopovers = () => {
		if (!optionsPopover) {
			throw new Error("OptionsPopover shouldn't be undefined.");
		}

		if (optionsPopover.matches(":popover-open")) {
			// Force a synchronous reflow before hiding — otherwise the popover can
			// briefly animate from a stale, not-yet-committed style.
			// oxlint-disable-next-line no-unused-expressions -- Reading offsetHeight forces a synchronous reflow
			optionsPopover.offsetHeight;
			optionsPopover.hidePopover();
		}
	};

	const unsubscribeIsOpen = props.codeBlock.quickActions.onToggle(() => {
		if (!props.codeBlock.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<span class={[{ hidden: !hasOptions() }]}>
			<button
				type="button"
				commandfor={optionsPopoverId}
				command="toggle-popover"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				aria-label="Code block options"
				disabled={props.readOnly?.checked()}
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
				<LanguageDropdown
					codeBlock={props.codeBlock}
					$codeBlock={props.$codeBlock}
					options={props.options}
					class={[{ hidden: !hasLanguages() }]}
				/>
				<ThemeDropdown
					codeBlock={props.codeBlock}
					$codeBlock={props.$codeBlock}
					options={props.options}
					theme="light"
					class={[{ hidden: !hasThemes() }]}
				/>
				<ThemeDropdown
					codeBlock={props.codeBlock}
					$codeBlock={props.$codeBlock}
					options={props.options}
					theme="dark"
					class={[{ hidden: !hasThemes() }]}
				/>
			</div>
		</span>
	);
};
