import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { CodeBlockLanguage, CodeBlockUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

const languages: CodeBlockLanguage[] = [
	"JavaScript",
	"TypeScript",
	"HTML",
	"CSS",
	"React",
	"Python",
	"Java",
	"C",
	"C++",
	"C#",
	"Rust",
	"Go",
	"Kotlin",
	"PHP",
	"Ruby",
	"Swift",
	"Dart",
	"SQL",
	"Bash",
	"Markdown",
];

interface CodeBlockToolbarButtonProps {
	uiPort: CodeBlockUIPort;
}

export const CodeBlockToolbarButton = (props: CodeBlockToolbarButtonProps) => {
	const uiPort = props.uiPort;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(uiPort.toolbarButton.disabled);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribe = uiPort.onToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list: DropdownList = languages.map((language) => {
		return {
			text: language,
			button: {
				"on:click": () => {
					uiPort.emitInsertRequest({ language });
				},
			},
		};
	});

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				commandfor={popoverId}
				command="toggle-popover"
				hasChevron={true}
			>
				<Icon name="CodeBlock" class="size-4" />
			</ToolbarButton>

			<Dropdown
				id={popoverId}
				list={list}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>
		</span>
	);
};
