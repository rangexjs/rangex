import { createMemo, createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type {
	LetterSpacingValue,
	LetterSpacingValues,
} from "../../../ToolbarButtonProps";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

const defaultValues: LetterSpacingValues = new Set([
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
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { letterSpacing } = formatStylesButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(letterSpacing.disabled);
	const [activeValues, setActiveValues] = createSignal(letterSpacing.values);

	const popoverId = createUniqueId();

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.letterSpacing,
		callback: (state) => {
			setDisabled(state.disabled);
			setActiveValues(state.values);
		},
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedLetterSpacings = createMemo(() => {
		const deduplicatedValues: LetterSpacingValue[] = [];

		const commonValues = [...defaultValues, ...activeValues()];

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

	const list = createMemo<DropdownList>(() => {
		const contains = (value: LetterSpacingValue) => {
			return !![...activeValues()].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedLetterSpacings().map<DropdownList[number]>((spacing) => {
			return {
				checked: contains(spacing),
				text: `${spacing.value}`,
				button: {
					"on:click": () => {
						toolbarButtonsActionManager.emitFormatStylesChange({
							letterSpacing: spacing,
						});
					},
					class: "justify-center",
				},
			};
		});
	});

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="LetterSpacing" class="size-4" />
			</ToolbarButton>
			<Dropdown
				id={popoverId}
				onToggle={onPopoverToggle}
				list={list()}
				class="[position-area:center_bottom]"
			/>
		</span>
	);
};
