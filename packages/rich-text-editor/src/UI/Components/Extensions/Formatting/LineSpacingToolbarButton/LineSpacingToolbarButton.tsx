import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingLineSpacingValue } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

const defaultValues: Set<FormattingLineSpacingValue> = new Set([
	{ type: "px", value: 0 },
	{ type: "px", value: 4 },
	{ type: "px", value: 8 },
	{ type: "px", value: 16 },
	{ type: "px", value: 24 },
]);

export const LineSpacingToolbarButton = () => {
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.lineSpacing.disabled,
	);
	const [activeValues, setActiveValues] = createSignal(
		formattingUIPort.lineSpacing.values,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribeLineSpacing = formattingUIPort.onLineSpacingUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
				setActiveValues(state.values);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeLineSpacing();
			unsubscribeReadOnly?.();
		});
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedList = createMemo(() => {
		const deduplicatedValues: FormattingLineSpacingValue[] = [];

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
		const contains = (value: FormattingLineSpacingValue) => {
			return !![...activeValues()].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedList().map<DropdownList[number]>((lineSpacing) => {
			return {
				checked: contains(lineSpacing),
				text: `${lineSpacing.value}`,
				button: {
					"on:click": () => {
						formattingUIPort.emitFormattingChange({ lineSpacing });
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
				<Icon name="ArrowsOutLineVertical" class="size-4" />
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
