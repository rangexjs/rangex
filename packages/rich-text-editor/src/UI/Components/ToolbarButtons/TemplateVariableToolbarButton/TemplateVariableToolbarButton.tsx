import { createMemo, createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type { TemplateVariableKind } from "../../../ToolbarButtonProps";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";
import { DateModal, EmailModal, NameModal } from "./VariableModals";

export const TemplateVariableToolbarButton = () => {
	const { nodeInsertionButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { templateVariable } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(templateVariable.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.templateVariable,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const popoverId = createUniqueId();

	const nameModalId = createUniqueId();
	const emailModalId = createUniqueId();
	const dateModalId = createUniqueId();

	const list = createMemo<DropdownList>(() => {
		const insertTemplate = (kind: TemplateVariableKind) => {
			toolbarButtonsActionManager.emitNodeInsertionChange({
				type: toolbarButtonsName.templateVariable,
				action: "insertion",
				kind,
			});
		};

		return [
			{
				text: "Full name",
				button: {
					"on:click": () => {
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
					"on:click": () => {
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
					"on:click": () => {
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
					"on:click": () => {
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
					"on:click": () => {
						insertTemplate("date");
					},
				},
				settings: {
					commandfor: dateModalId,
					command: "show-modal",
				},
			},
		];
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
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
			<Dropdown
				id={popoverId}
				list={list()}
				class="[position-area:center_bottom]"
				onToggle={onPopoverToggle}
			/>
			<NameModal
				modalId={nameModalId}
				nodeInsertionButtonStateManager={nodeInsertionButtonsStateManager}
				toolbarButtonsActionManager={toolbarButtonsActionManager}
			/>
			<EmailModal
				modalId={emailModalId}
				nodeInsertionButtonStateManager={nodeInsertionButtonsStateManager}
				toolbarButtonsActionManager={toolbarButtonsActionManager}
			/>
			<DateModal
				modalId={dateModalId}
				nodeInsertionButtonStateManager={nodeInsertionButtonsStateManager}
				toolbarButtonsActionManager={toolbarButtonsActionManager}
			/>
		</span>
	);
};
