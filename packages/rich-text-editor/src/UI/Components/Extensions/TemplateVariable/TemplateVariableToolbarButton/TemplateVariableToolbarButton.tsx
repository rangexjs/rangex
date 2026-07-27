import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { TemplateVariableKind } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../../_Utilities";
import { DateModal, EmailModal, NameModal } from "./VariableModals";

export const TemplateVariableToolbarButton = () => {
	const { templateVariableUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!templateVariableUIPort) {
		throw new Error("TemplateVariableUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		templateVariableUIPort.toolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeToolbarButton =
			templateVariableUIPort.onToolbarButtonUpdate((state) => {
				setButtonDisabled(state.disabled);
			});
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeToolbarButton();
			unsubscribeReadOnly?.();
		});
	});

	const popoverId = createUniqueId();

	const nameModalId = createUniqueId();
	const emailModalId = createUniqueId();
	const dateModalId = createUniqueId();

	const list = createMemo<DropdownList>(() => {
		const insertTemplate = (kind: TemplateVariableKind) => {
			templateVariableUIPort.emitInsertRequest({ kind });
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

	const disabled = createMemo(() => buttonDisabled() || readOnly());

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
			<NameModal modalId={nameModalId} uiPort={templateVariableUIPort} />
			<EmailModal modalId={emailModalId} uiPort={templateVariableUIPort} />
			<DateModal modalId={dateModalId} uiPort={templateVariableUIPort} />
		</span>
	);
};
