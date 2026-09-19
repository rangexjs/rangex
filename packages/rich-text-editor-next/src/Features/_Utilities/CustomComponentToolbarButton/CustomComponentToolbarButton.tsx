import { AccordionItem, ReadOnly, Separator } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../ToolbarButton";
import { ToolbarDropdown, type ToolbarDropdownList } from "../ToolbarDropdown";

export const CustomComponentToolbarButton = () => {
	const editor = useEditorContext();
	const { accordionItem, separator, readOnly } = editor;
	const $accordionItem = AccordionItem(accordionItem);
	const $separator = Separator(separator);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const disabled = createMemo(
		() =>
			!($accordionItem?.canInsert() || $separator?.canInsert()) ||
			!!$readOnly?.checked(),
	);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list = createMemo<ToolbarDropdownList>(() => {
		const items: ToolbarDropdownList = [];

		if (accordionItem && $accordionItem) {
			items.push({
				icon: "CaretCircleRight",
				text: "Accordion",
				button: {
					disabled: !$accordionItem.canInsert(),
					onClick: () => {
						accordionItem.insert();
					},
				},
			});
		}

		if (separator && $separator) {
			items.push({
				icon: "Separator",
				text: "Separator",
				button: {
					disabled: !$separator.canInsert(),
					onClick: () => {
						separator.insert();
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
