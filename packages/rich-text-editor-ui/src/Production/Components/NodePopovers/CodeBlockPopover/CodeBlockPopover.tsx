import {
	createSignal,
	createUniqueId,
	For,
	onCleanup,
	onMount,
} from "solid-js";
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

interface OptionDropdownProps<Option extends string> {
	label: string;
	value: NoInfer<Option>;
	options: Option[];
	onSelect: (value: NoInfer<Option>) => void;
	class?: string;
}

const OptionDropdown = <Option extends string>(
	props: OptionDropdownProps<Option>,
) => {
	const popoverId = createUniqueId();

	return (
		<div class="flex flex-col gap-1" classList={{ [props.class ?? ""]: true }}>
			<span class="font-medium text-neutral-600 text-xs dark:text-neutral-300">
				{props.label}
			</span>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				class="flex w-full items-center justify-between gap-2 rounded-md border border-neutral-200 px-2 py-1 font-medium text-neutral-800 text-xs transition-colors hover:bg-neutral-50 active:border-neutral-300 dark:border-neutral-600 dark:text-neutral-100 dark:active:border-neutral-500 dark:hover:bg-neutral-800"
				classList={{
					"[&:has(~:popover-open)]:mb-px [&:has(~:popover-open)]:rounded-b-none [&:has(~:popover-open)]:border-b-0": true,
				}}
			>
				<span class="truncate">{props.value}</span>
				<Icon
					name="CaretDown"
					class="size-2 shrink-0 text-neutral-400 dark:text-neutral-500"
				/>
			</button>
			<div
				id={popoverId}
				popover="auto"
				class="max-h-48 w-[anchor-size(width)] overflow-y-auto rounded-b-md border-neutral-200 border-r border-b border-l bg-white shadow-lg [position-area:center_bottom] [scrollbar-width:thin] dark:border-neutral-700 dark:bg-neutral-800"
			>
				<For each={props.options}>
					{(option) => (
						<button
							type="button"
							commandfor={popoverId}
							command="hide-popover"
							class="w-full border border-transparent px-2 py-1 text-left font-medium text-neutral-600 text-xs leading-normal transition-colors hover:border-neutral-100 hover:bg-neutral-100 active:border-neutral-200 dark:text-neutral-300 dark:active:border-neutral-500 dark:hover:border-neutral-600 dark:hover:bg-neutral-700"
							classList={{ hidden: option === props.value }}
							on:click={() => {
								props.onSelect(option);
							}}
						>
							{option}
						</button>
					)}
				</For>
			</div>
		</div>
	);
};

export const CodeBlockPopover = () => {
	const { codeBlockLanguages, codeBlockThemes } = useEditorOptionsContext();
	const { codeBlockPopoverController: controller } =
		usePopoverControllersContext();

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
			return;
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
					options={codeBlockLanguages}
					onSelect={(lang) => controller.emitLanguageChange(lang)}
				/>
				<OptionDropdown
					label="☀ Light"
					value={lightTheme()}
					options={codeBlockThemes}
					onSelect={(theme) => controller.emitLightThemeChange(theme)}
					class="flex-1"
				/>
				<OptionDropdown
					label="☾ Dark"
					value={darkTheme()}
					options={codeBlockThemes}
					onSelect={(theme) => controller.emitDarkThemeChange(theme)}
					class="flex-1"
				/>
			</div>
		</div>
	);
};
