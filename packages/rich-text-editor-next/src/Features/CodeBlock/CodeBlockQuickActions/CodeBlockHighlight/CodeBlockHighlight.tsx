import type { CodeBlockPublicPort } from "@rangex/editor";
import type {
	ReactiveCodeBlockPort,
	ReactiveReadOnlyPort,
} from "@rangex/solid";
import { createMemo, createUniqueId, onCleanup } from "solid-js";
import { Icon } from "#ui";
import { OptionDropdown } from "../../../_Utilities";

export interface CodeBlockHighlightProps {
	codeBlock: CodeBlockPublicPort;
	$codeBlock: ReactiveCodeBlockPort;
	readOnly: ReactiveReadOnlyPort | undefined;
}

const plainText = "Plain Text" as const;

export const CodeBlockHighlight = (props: CodeBlockHighlightProps) => {
	const languageOptions = [
		{ label: plainText, value: plainText },
		...props.codeBlock.languages.map(({ id, label }) => ({ label, value: id })),
	];

	const themeOptions = props.codeBlock.themes.map(({ id, label }) => ({
		label,
		value: id,
	}));

	const language = createMemo(() => props.$codeBlock.language() ?? plainText);

	const theme = createMemo(() => {
		const value = props.$codeBlock.theme() ?? props.codeBlock.defaultTheme;

		if (value === null) {
			throw new Error("Theme isn't available.");
		}

		return value;
	});

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

	const unsubscribeIsOpen = props.codeBlock.quickActions.onToggle(() => {
		if (!props.codeBlock.quickActions.isOpen) {
			closeNestedPopovers();
		}
	});

	onCleanup(() => {
		unsubscribeIsOpen();
	});

	return (
		<>
			<button
				type="button"
				commandfor={optionsPopoverId}
				command="toggle-popover"
				class="btn-menu-trigger flex items-center justify-center rounded p-1"
				title="Options"
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
				<OptionDropdown
					label="Language"
					value={language()}
					options={languageOptions}
					onSelect={(selected) =>
						props.codeBlock.changeLanguage(
							selected === plainText ? null : selected,
						)
					}
				/>
				<OptionDropdown
					label="☀ Light"
					value={theme().light}
					options={themeOptions}
					onSelect={(light) =>
						props.codeBlock.changeTheme({ ...theme(), light })
					}
					class="flex-1"
				/>
				<OptionDropdown
					label="☾ Dark"
					value={theme().dark}
					options={themeOptions}
					onSelect={(dark) => props.codeBlock.changeTheme({ ...theme(), dark })}
					class="flex-1"
				/>
			</div>
		</>
	);
};
