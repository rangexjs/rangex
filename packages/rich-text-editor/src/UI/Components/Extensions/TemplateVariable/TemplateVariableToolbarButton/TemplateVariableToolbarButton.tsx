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
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";
import { DateModal, EmailModal, NameModal } from "./VariableModals";

export const TemplateVariableToolbarButton = () => {
	const { templateVariableUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("TemplateVariableUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(uiPort.toolbarButton.disabled);

	onMount(() => {
		const unsubscribe = uiPort.onToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const popoverId = createUniqueId();

	const nameModalId = createUniqueId();
	const emailModalId = createUniqueId();
	const dateModalId = createUniqueId();

	const list = createMemo<DropdownList>(() => {
		const insertTemplate = (kind: TemplateVariableKind) => {
			uiPort.emitInsertRequest({ kind });
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
			<NameModal modalId={nameModalId} uiPort={uiPort} />
			<EmailModal modalId={emailModalId} uiPort={uiPort} />
			<DateModal modalId={dateModalId} uiPort={uiPort} />
		</span>
	);
};
