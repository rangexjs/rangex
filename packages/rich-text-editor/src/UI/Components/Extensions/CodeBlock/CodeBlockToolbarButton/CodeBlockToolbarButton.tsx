import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { CodeBlockLanguage } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

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

export const CodeBlockToolbarButton = () => {
	const { codeBlockUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!codeBlockUIPort) {
		throw new Error("CodeBlockUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		codeBlockUIPort.toolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribeToolbarButton = codeBlockUIPort.onToolbarButtonUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeToolbarButton();
			unsubscribeReadOnly?.();
		});
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list: ToolbarDropdownList = languages.map((language) => {
		return {
			text: language,
			button: {
				"on:click": () => {
					codeBlockUIPort.emitInsertRequest({ language });
				},
			},
		};
	});

	const disabled = createMemo(() => buttonDisabled() || readOnly());

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

			<ToolbarDropdown
				id={popoverId}
				list={list}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>
		</span>
	);
};
