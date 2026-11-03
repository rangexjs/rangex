import type { LetterSpacingValue } from "@rangex/editor/formatting";
import { LetterSpacing, ReadOnly } from "@rangex/solid";
import { createMemo, createSignal, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { isDeepEqual } from "#utilities";
import {
	ToolbarButton,
	ToolbarDropdown,
	type ToolbarDropdownList,
} from "../../_Utilities";

const defaultValues: Set<LetterSpacingValue> = new Set([
	{ type: "px", value: -3 },
	{ type: "px", value: -2 },
	{ type: "px", value: -1.5 },
	{ type: "px", value: -1 },
	{ type: "px", value: -0.5 },
	{ type: "px", value: 0 },
	{ type: "px", value: 0.5 },
	{ type: "px", value: 1 },
	{ type: "px", value: 1.5 },
	{ type: "px", value: 2 },
	{ type: "px", value: 3 },
	{ type: "px", value: 4 },
	{ type: "px", value: 5 },
	{ type: "px", value: 6 },
	{ type: "px", value: 8 },
	{ type: "px", value: 10 },
]);

export const LetterSpacingToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $letterSpacing = LetterSpacing(formatting);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedLetterSpacings = createMemo(
		() => {
			const deduplicatedValues: LetterSpacingValue[] = [];

			const commonValues = [...defaultValues, ...$letterSpacing.values()];

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
		const activeValues = $letterSpacing.values();

		const contains = (value: LetterSpacingValue) => {
			return !![...activeValues].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedLetterSpacings().map<ToolbarDropdownList[number]>(
			(spacing) => {
				return {
					checked: contains(spacing),
					text: `${spacing.value}`,
					button: {
						onClick: () => {
							formatting.setLetterSpacing(spacing);
						},
						class: "justify-center",
					},
				};
			},
		);
	});

	const disabled = createMemo(
		() => $letterSpacing.disabled() || !!$readOnly?.checked(),
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
				<Icon name="LetterSpacing" title="Letter spacing" class="size-4" />
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
