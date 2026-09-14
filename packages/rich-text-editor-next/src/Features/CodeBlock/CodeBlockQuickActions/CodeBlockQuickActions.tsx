import { CodeBlock, FloatingPortal, ReadOnly } from "@rangex/solid";
import { createSignal, createUniqueId, onCleanup } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { OptionDropdown } from "../../_Utilities";

export const CodeBlockQuickActions = () => {
	const { codeBlock, readOnly } = useEditorContext();

	if (!codeBlock) {
		throw new Error("CodeBlock can't be undefined.");
	}

	const $codeBlock = CodeBlock(codeBlock);
	const $readOnly = ReadOnly(readOnly);

	const languageOptions = codeBlock.languages.map((language) => ({
		label: language,
		value: language,
	}));

	const themeOptions = codeBlock.themes.map((theme) => ({
		label: theme,
		value: theme,
	}));

	const [copied, setCopied] = createSignal(false);

	const optionsPopoverId = createUniqueId();

	let optionsPopover: HTMLDivElement | undefined;

	const closeNestedPopovers = () => {
		if (!optionsPopover) {
			throw new Error("OptionsPopover shouldn't be undefined.");
		}

		if (optionsPopover.matches(":popover-open")) {
			// Force a synchronous reflow before hiding — otherwise the popover can
			// briefly animate from a stale, not-yet-committed style.
			optionsPopover.offsetHeight;
			optionsPopover.hidePopover();
		}
	};

	const unsubscribeIsOpen = codeBlock.quickActions.onToggle(() => {
		if (!codeBlock.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	const onCopyClick = (() => {
		let timeoutId = NaN;
		return () => {
			const plainText = codeBlock.getPlainText();
			const lines = plainText.join("\n");
			navigator.clipboard.writeText(lines);
			setCopied(true);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setCopied(false), 1200);
		};
	})();

	return (
		<FloatingPortal mount={codeBlock.quickActions.element}>
			<div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
				<button
					type="button"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					title="Copy"
					disabled={$readOnly?.checked()}
					onClick={onCopyClick}
				>
					<Icon name={copied() ? "Check" : "CopySimple"} class="size-4" />
				</button>

				<button
					type="button"
					commandfor={optionsPopoverId}
					command="toggle-popover"
					class="btn-menu-trigger flex items-center justify-center rounded p-1"
					title="Options"
					disabled={$readOnly?.checked()}
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
						value={$codeBlock.language()}
						options={languageOptions}
						onSelect={(language) => codeBlock.changeLanguage(language)}
					/>
					<OptionDropdown
						label="☀ Light"
						value={$codeBlock.lightTheme()}
						options={themeOptions}
						onSelect={(theme) => codeBlock.changeLightTheme(theme)}
						class="flex-1"
					/>
					<OptionDropdown
						label="☾ Dark"
						value={$codeBlock.darkTheme()}
						options={themeOptions}
						onSelect={(theme) => codeBlock.changeDarkTheme(theme)}
						class="flex-1"
					/>
				</div>
			</div>
		</FloatingPortal>
	);
};
