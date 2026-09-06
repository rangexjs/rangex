import type { FormattingLineHeightValue } from "@rangex/editor";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
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
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(() => {
		const deduplicatedValues: FormattingLineHeightValue[] = [];

		const commonValues = [...defaultValues, ...formatting.lineHeight().values];

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
	});

	const list = createMemo<ToolbarDropdownList>(() => {
		const activeValues = formatting.lineHeight().values;

		const contains = (value: FormattingLineHeightValue) => {
			return !![...activeValues].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedList().map((lineHeight) => {
			return {
				checked: contains(lineHeight),
				text: `${lineHeight.value}`,
				button: {
					onClick: () => {
						formatting.setLineHeight(lineHeight);
					},
					class: "justify-center",
				},
			};
		});
	});

	const disabled = createMemo(
		() => formatting.lineHeight().disabled || !!readOnly?.checked(),
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
				<Icon name="LineHeight" class="size-4" />
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
