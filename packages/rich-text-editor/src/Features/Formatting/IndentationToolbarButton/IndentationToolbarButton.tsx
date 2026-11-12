import type { TextIndentValue } from "@rangex/editor/formatting";
import { Indentation, ReadOnly } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId } from "solid-js";

import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { isDeepEqual } from "#utilities";

import { ToolbarButton, ToolbarDropdown, type ToolbarDropdownList } from "../../_Utilities";

const defaultValues: Set<TextIndentValue> = new Set([
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
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $indentation = Indentation(formatting);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(
		() => {
			const deduplicatedValues: TextIndentValue[] = [];

			const commonValues = [...defaultValues, ...$indentation.values()];

			for (const commonValue of commonValues) {
				const matchedValue = deduplicatedValues.find(
					(val) => val.type === commonValue.type && val.value === commonValue.value,
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
		const activeValues = $indentation.values();

		const contains = (value: TextIndentValue) => {
			return !![...activeValues].find(
				(activeValue) => activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		const defaultItem: ToolbarDropdownList[number] = {
			checked: $indentation.hasUnset(),
			text: "Default",
			button: {
				onClick: () => formatting.setIndentation(null),
				class: "justify-center",
			},
		};

		const indentationItems = sortedList().map<ToolbarDropdownList[number]>((indentationItem) => {
			return {
				checked: contains(indentationItem),
				text: `${indentationItem.value}`,
				button: {
					onClick: () => {
						formatting.setIndentation(indentationItem);
					},
					class: "justify-center",
				},
			};
		});

		return [defaultItem, ...indentationItems];
	});

	const disabled = createMemo(() => $indentation.disabled() || !!$readOnly?.checked());

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="Indentation" title="Indentation" class="size-4" />
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
