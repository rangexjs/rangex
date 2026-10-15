import type { FormattingLineHeightValue } from "@rangex/editor/formatting";
import { LineHeight, ReadOnly } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { isDeepEqual } from "#utilities";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

const defaultValues: Set<FormattingLineHeightValue> = new Set([
	{ type: "number", value: 0.8 },
	{ type: "number", value: 0.9 },
	{ type: "number", value: 1 },
	{ type: "number", value: 1.25 },
	{ type: "number", value: 1.5 },
	{ type: "number", value: 1.75 },
	{ type: "number", value: 2 },
	{ type: "number", value: 2.5 },
	{ type: "number", value: 3 },
]);

export const LineHeightToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $lineHeight = LineHeight(formatting);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(
		() => {
			const deduplicatedValues: FormattingLineHeightValue[] = [];

			const commonValues = [...defaultValues, ...$lineHeight.values()];

			for (const commonValue of commonValues) {
				const matchedValue = deduplicatedValues.find(
					(val) =>
						val.type === commonValue.type && val.value === commonValue.value,
				);

				if (matchedValue) {
					continue;
				}

				deduplicatedValues.push(commonValue);
			}

			return deduplicatedValues.toSorted((a, b) => a.value - b.value);
		},
		{ equals: isDeepEqual },
	);

	const list = createMemo<ToolbarDropdownList>(() => {
		const activeValues = $lineHeight.values();

		const contains = (value: FormattingLineHeightValue) => {
			return !![...activeValues].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		const defaultItem: ToolbarDropdownList[number] = {
			checked: $lineHeight.hasUnset(),
			text: "Default",
			button: {
				onClick: () => formatting.setLineHeight(null),
				class: "justify-center",
			},
		};

		const lineHeightItems = sortedList().map<ToolbarDropdownList[number]>(
			(lineHeightItem) => {
				return {
					checked: contains(lineHeightItem),
					text: `${lineHeightItem.value}`,
					button: {
						onClick: () => {
							formatting.setLineHeight(lineHeightItem);
						},
						class: "justify-center",
					},
				};
			},
		);

		return [defaultItem, ...lineHeightItems];
	});

	const disabled = createMemo(
		() => $lineHeight.disabled() || !!$readOnly?.checked(),
	);

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="LineHeight" title="Line height" class="size-4" />
			</ToolbarButton>
			<ToolbarDropdown
				id={popoverId}
				onToggle={onPopoverToggle}
				list={list()}
				class="[position-area:center_bottom]"
			/>
		</span>
	);
};
