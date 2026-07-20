import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingLineHeightValue, FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

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

interface LineHeightToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const LineHeightToolbarButton = (
	props: LineHeightToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(uiPort.lineHeight.disabled);
	const [activeValues, setActiveValues] = createSignal(
		uiPort.lineHeight.values,
	);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribe = uiPort.onLineHeightUpdate((state) => {
			setDisabled(state.disabled);
			setActiveValues(state.values);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(() => {
		const deduplicatedValues: FormattingLineHeightValue[] = [];

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
		const contains = (value: FormattingLineHeightValue) => {
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
						uiPort.emitFormattingChange({ lineHeight });
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
