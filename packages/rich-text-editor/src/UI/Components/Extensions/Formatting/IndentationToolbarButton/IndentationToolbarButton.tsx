import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingIndentationValue, FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import {
	Dropdown,
	type DropdownList,
	ToolbarButton,
} from "../../../ToolbarButtons/_Utilities";

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

interface IndentationToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const IndentationToolbarButton = (
	props: IndentationToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(uiPort.indentation.disabled);
	const [activeValues, setActiveValues] = createSignal(
		uiPort.indentation.values,
	);

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribe = uiPort.onIndentationUpdate((state) => {
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
		const deduplicatedValues: FormattingIndentationValue[] = [];

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
		const contains = (value: FormattingIndentationValue) => {
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
						uiPort.emitFormattingChange({ indentation });
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
