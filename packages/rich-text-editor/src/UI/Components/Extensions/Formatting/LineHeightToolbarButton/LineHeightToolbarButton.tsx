import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingLineHeightValue } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../../_Utilities";

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
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.lineHeight.disabled,
	);
	const [activeValues, setActiveValues] = createSignal(
		formattingUIPort.lineHeight.values,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribeLineHeight = formattingUIPort.onLineHeightUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
				setActiveValues(state.values);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeLineHeight();
			unsubscribeReadOnly?.();
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
						formattingUIPort.emitFormattingChange({ lineHeight });
					},
					class: "justify-center",
				},
			};
		});
	});

	const disabled = createMemo(() => buttonDisabled() || readOnly());

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
