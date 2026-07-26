import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

export const CustomComponentToolbarButton = () => {
	const { accordionItemUIPort } = useUIPortsContext();

	const [checked, setChecked] = createSignal(false);
	const [accordionItemDisabled, setAccordionItemDisabled] = createSignal(
		accordionItemUIPort?.toolbarButton.disabled ?? true,
	);

	onMount(() => {
		if (!accordionItemUIPort) {
			return;
		}

		const unsubscribe = accordionItemUIPort.onToolbarButtonUpdate((state) => {
			setAccordionItemDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	// The button itself is only disabled once every known custom-component uiPort's own
	// toolbarButton is disabled — right now that's just accordionItemDisabled, AND-reduced
	// with whichever other custom-component uiPorts get added here later.
	const disabled = createMemo(() => accordionItemDisabled());

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list = createMemo<DropdownList>(() => {
		const items: DropdownList = [];

		if (accordionItemUIPort) {
			items.push({
				text: "Accordion",
				button: {
					disabled: accordionItemDisabled(),
					"on:click": () => {
						accordionItemUIPort.emitInsertRequest();
					},
				},
			});
		}

		return items;
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
				<Icon name="SquaresFour" class="size-4" />
			</ToolbarButton>

			<Dropdown
				id={popoverId}
				list={list()}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>
		</span>
	);
};
