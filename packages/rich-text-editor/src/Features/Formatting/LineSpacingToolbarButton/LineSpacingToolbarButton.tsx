import type { FormattingLineSpacingValue } from "@rangex/editor/formatting";
import { LineSpacing, ReadOnly } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { isDeepEqual } from "#utilities";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

const defaultValues: Set<FormattingLineSpacingValue> = new Set([
	{ type: "px", value: 4 },
	{ type: "px", value: 8 },
	{ type: "px", value: 16 },
	{ type: "px", value: 24 },
]);

export const LineSpacingToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $lineSpacing = LineSpacing(formatting);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(
		() => {
			const deduplicatedValues: FormattingLineSpacingValue[] = [];

			const commonValues = [...defaultValues, ...$lineSpacing.values()];

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
		const activeValues = $lineSpacing.values();

		const contains = (value: FormattingLineSpacingValue) => {
			return !![...activeValues].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		const defaultItem: ToolbarDropdownList[number] = {
			checked: $lineSpacing.hasUnset(),
			text: "Default",
			button: {
				onClick: () => formatting.setLineSpacing(null),
				class: "justify-center",
			},
		};

		const lineSpacingItems = sortedList().map<ToolbarDropdownList[number]>(
			(lineSpacingItem) => {
				return {
					checked: contains(lineSpacingItem),
					text: `${lineSpacingItem.value}`,
					button: {
						onClick: () => {
							formatting.setLineSpacing(lineSpacingItem);
						},
						class: "justify-center",
					},
				};
			},
		);

		return [defaultItem, ...lineSpacingItems];
	});

	const disabled = createMemo(
		() => $lineSpacing.disabled() || !!$readOnly?.checked(),
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
				<Icon
					name="ArrowsOutLineVertical"
					title="Line spacing"
					class="size-4"
				/>
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
