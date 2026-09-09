import type { TemplateVariableKind } from "@rangex/editor";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";
import { DateModal, EmailModal, NameModal } from "./VariableModals";

export const TemplateVariableToolbarButton = () => {
	const { templateVariable, readOnly } = useReactiveEditorContext();

	if (!templateVariable) {
		throw new Error("TemplateVariable can't be undefined.");
	}

	const [checked, setChecked] = createSignal(false);

	const disabled = createMemo(
		() => !templateVariable.canInsert() || !!readOnly?.checked(),
	);

	const popoverId = createUniqueId();

	const nameModalId = createUniqueId();
	const emailModalId = createUniqueId();
	const dateModalId = createUniqueId();

	const insertTemplate = (kind: TemplateVariableKind) => {
		templateVariable.insert({ kind });
	};

	const list: ToolbarDropdownList = [
		{
			text: "Full name",
			button: {
				onClick: () => {
					insertTemplate("full-name");
				},
			},
			settings: {
				commandfor: nameModalId,
				command: "show-modal",
			},
		},
		{
			text: "First name",
			button: {
				onClick: () => {
					insertTemplate("first-name");
				},
			},
			settings: {
				commandfor: nameModalId,
				command: "show-modal",
			},
		},
		{
			text: "Last name",
			button: {
				onClick: () => {
					insertTemplate("last-name");
				},
			},
			settings: {
				commandfor: nameModalId,
				command: "show-modal",
			},
		},
		{
			text: "Email",
			button: {
				onClick: () => {
					insertTemplate("email");
				},
			},
			settings: {
				commandfor: emailModalId,
				command: "show-modal",
			},
		},
		{
			text: "Date",
			button: {
				onClick: () => {
					insertTemplate("date");
				},
			},
			settings: {
				commandfor: dateModalId,
				command: "show-modal",
			},
		},
	];

	const onPopoverToggle = (event: ToggleEvent) => {
		setChecked(event.newState === "open");
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="TemplateVariable" class="size-4" />
			</ToolbarButton>

			<ToolbarDropdown
				id={popoverId}
				list={list}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>

			<NameModal modalId={nameModalId} templateVariable={templateVariable} />
			<EmailModal modalId={emailModalId} templateVariable={templateVariable} />
			<DateModal modalId={dateModalId} templateVariable={templateVariable} />
		</span>
	);
};
