import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../ToolbarButton";
import { ToolbarDropdown, type ToolbarDropdownList } from "../ToolbarDropdown";

export const CustomComponentToolbarButton = () => {
	const { accordionItemUIPort, separatorUIPort, readOnlyUIPort } =
		useUIPortsContext();

	const [checked, setChecked] = createSignal(false);
	const [accordionItemDisabled, setAccordionItemDisabled] = createSignal(
		accordionItemUIPort?.toolbarButton.disabled ?? true,
	);
	const [separatorDisabled, setSeparatorDisabled] = createSignal(
		separatorUIPort?.toolbarButton.disabled ?? true,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeAccordionItem = accordionItemUIPort?.onToolbarButtonUpdate(
			(state) => {
				setAccordionItemDisabled(state.disabled);
			},
		);
		const unsubscribeSeparator = separatorUIPort?.onToolbarButtonUpdate(
			(state) => {
				setSeparatorDisabled(state.disabled);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeAccordionItem?.();
			unsubscribeSeparator?.();
			unsubscribeReadOnly?.();
		});
	});

	const buttonDisabled = createMemo(
		() => accordionItemDisabled() && separatorDisabled(),
	);

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list = createMemo<ToolbarDropdownList>(() => {
		const items: ToolbarDropdownList = [];

		if (accordionItemUIPort) {
			items.push({
				icon: "CaretCircleRight",
				text: "Accordion",
				button: {
					disabled: accordionItemDisabled(),
					"on:click": () => {
						accordionItemUIPort.emitInsertRequest();
					},
				},
			});
		}

		if (separatorUIPort) {
			items.push({
				icon: "Separator",
				text: "Separator",
				button: {
					disabled: separatorDisabled(),
					"on:click": () => {
						separatorUIPort.emitInsertRequest();
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

			<ToolbarDropdown
				id={popoverId}
				list={list()}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>
		</span>
	);
};
