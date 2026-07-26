import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingLetterSpacingValue } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

const defaultValues: Set<FormattingLetterSpacingValue> = new Set([
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
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.letterSpacing.disabled,
	);
	const [activeValues, setActiveValues] = createSignal(
		formattingUIPort.letterSpacing.values,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribeLetterSpacing = formattingUIPort.onLetterSpacingUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
				setActiveValues(state.values);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeLetterSpacing();
			unsubscribeReadOnly?.();
		});
	});

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const sortedLetterSpacings = createMemo(() => {
		const deduplicatedValues: FormattingLetterSpacingValue[] = [];

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
		const contains = (value: FormattingLetterSpacingValue) => {
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
						formattingUIPort.emitFormattingChange({ letterSpacing: spacing });
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
