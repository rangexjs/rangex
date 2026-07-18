import { createSignal, createUniqueId } from "solid-js";
import type { CodeBlockLanguage } from "#ports";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

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
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { codeBlock } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(codeBlock.disabled);

	const popoverId = createUniqueId();

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.codeBlock,
		callback: (state) => setDisabled(state.disabled),
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
					toolbarButtonsActionManager.emitNodeInsertionChange({
						type: toolbarButtonsName.codeBlock,
						language,
					});
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
