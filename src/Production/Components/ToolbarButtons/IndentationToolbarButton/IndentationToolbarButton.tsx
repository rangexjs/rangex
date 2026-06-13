import { createMemo, createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import type {
	IndentationValue,
	IndentationValues,
} from "../../../ToolbarButtonProps";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

const defaultValues: IndentationValues = new Set([
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
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { indentation } = formatStylesButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(indentation.disabled);
	const [activeValues, setActiveValues] = createSignal(indentation.values);

	const popoverId = createUniqueId();

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.indentation,
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
		const deduplicatedValues: IndentationValue[] = [];

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
		const contains = (value: IndentationValue) => {
			return !![...activeValues()].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedList().map<DropdownList[number]>((indentation) => {
			return {
				checked: contains(indentation),
				text: `${indentation.value}`,
				button: {
					"on:click": () => {
						toolbarButtonsActionManager.emitFormatStylesChange({ indentation });
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
				<Icon name="Indentation" class="size-4" />
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
