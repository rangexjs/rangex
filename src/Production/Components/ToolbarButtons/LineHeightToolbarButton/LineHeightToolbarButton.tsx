import { createMemo, createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type {
	LineHeightValue,
	LineHeightValues,
} from "../../../ToolbarButtonProps";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

const defaultValues: LineHeightValues = new Set([
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
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { lineHeight } = formatStylesButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(lineHeight.disabled);
	const [activeValues, setActiveValues] = createSignal(lineHeight.values);

	const popoverId = createUniqueId();

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.lineHeight,
		callback: (state) => {
			setDisabled(state.disabled);
			setActiveValues(state.values);
		},
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(() => {
		const deduplicatedValues: LineHeightValue[] = [];

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
		const contains = (value: LineHeightValue) => {
			return !![...activeValues()].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedList().map((lineHeight) => {
			return {
				checked: contains(lineHeight),
				text: `${lineHeight.value}`,
				button: {
					"on:click": () => {
						toolbarButtonsActionManager.emitFormatStylesChange({ lineHeight });
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
				<Icon name="LineHeight" class="size-4" />
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
