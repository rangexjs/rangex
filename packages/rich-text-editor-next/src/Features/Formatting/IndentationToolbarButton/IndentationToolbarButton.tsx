import type { FormattingIndentationValue } from "@rangex/editor";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

const defaultValues: Set<FormattingIndentationValue> = new Set([
	{ type: "px", value: 0 },
	{ type: "px", value: 4 },
	{ type: "px", value: 8 },
	{ type: "px", value: 12 },
	{ type: "px", value: 16 },
	{ type: "px", value: 20 },
	{ type: "px", value: 24 },
	{ type: "px", value: 32 },
	{ type: "px", value: 40 },
	{ type: "px", value: 48 },
	{ type: "px", value: 64 },
	{ type: "px", value: 72 },
	{ type: "px", value: 96 },
	{ type: "px", value: 120 },
]);

export const IndentationToolbarButton = () => {
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
		const deduplicatedValues: FormattingIndentationValue[] = [];

		const commonValues = [...defaultValues, ...formatting.indentation().values];

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
		const activeValues = formatting.indentation().values;

		const contains = (value: FormattingIndentationValue) => {
			return !![...activeValues].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedList().map<ToolbarDropdownList[number]>((indentation) => {
			return {
				checked: contains(indentation),
				text: `${indentation.value}`,
				button: {
					onClick: () => {
						formatting.setIndentation(indentation);
					},
					class: "justify-center",
				},
			};
		});
	});

	const disabled = createMemo(
		() => formatting.indentation().disabled || !!readOnly?.checked(),
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
				<Icon name="Indentation" class="size-4" />
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
