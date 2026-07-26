import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingFontSizeValue } from "#adapters";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import {
	createTextFieldController,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";
import {
	Dropdown,
	type DropdownList,
} from "../../../ToolbarButtons/_Utilities";

const fontSizeValues: FormattingFontSizeValue[] = [
	{ type: "px", value: 10 },
	{ type: "px", value: 11 },
	{ type: "px", value: 12 },
	{ type: "px", value: 13 },
	{ type: "px", value: 14 },
	{ type: "px", value: 15 },
	{ type: "px", value: 16 },
	{ type: "px", value: 20 },
	{ type: "px", value: 22 },
	{ type: "px", value: 24 },
	{ type: "px", value: 36 },
	{ type: "px", value: 40 },
	{ type: "px", value: 48 },
	{ type: "px", value: 64 },
	{ type: "px", value: 96 },
	{ type: "px", value: 128 },
] as const;

const getInputValueFromActiveValues = (
	fontSizes: Set<FormattingFontSizeValue>,
	defaultValue: FormattingFontSizeValue,
): string => {
	if (fontSizes.size === 0) {
		return `${defaultValue.value}`;
	}

	if (fontSizes.size === 1) {
		const { value } = fontSizes.values().next();

		if (!value) {
			throw new Error("Value can't be undefined.");
		}

		return `${value.value}`;
	}

	return "Mixed";
};

export const FontSizeToolbarButton = () => {
	const { formattingUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [disabled, setDisabled] = createSignal(uiPort.fontSize.disabled);
	const [activeValues, setActiveValues] = createSignal(uiPort.fontSize.values);
	const [inputModel, inputControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getInputValueFromActiveValues(
				activeValues(),
				uiPort.defaultFontSize,
			),
		});

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribe = uiPort.onFontSizeUpdate((state) => {
			setDisabled(state.disabled);
			setActiveValues(state.values);
			inputModel.setValue(
				getInputValueFromActiveValues(state.values, uiPort.defaultFontSize),
			);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const handleKeydown = (event: KeyboardEvent) => {
		const { code, currentTarget } = event;

		if (!(currentTarget instanceof HTMLInputElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		if (code !== "Enter") {
			return;
		}

		const { value } = currentTarget;

		if (!value || /[^\d]/.test(value)) {
			return;
		}

		const numValue = +value;
		const defaultFontSize = uiPort.defaultFontSize;
		const fontSize: FormattingFontSizeValue | null =
			numValue === defaultFontSize.value
				? null
				: { type: "px", value: numValue };

		uiPort.emitFormattingChange({ fontSize });
	};

	const handleBlur = (event: FocusEvent) => {
		const { currentTarget } = event;

		if (!(currentTarget instanceof HTMLInputElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		const { value } = currentTarget;

		const activeValue = getInputValueFromActiveValues(
			activeValues(),
			uiPort.defaultFontSize,
		);

		if (!value || value === activeValue || /[^\d]/.test(value)) {
			inputModel.setValue(activeValue);
			return;
		}

		const numValue = +value;
		const defaultFontSize = uiPort.defaultFontSize;
		const fontSize: FormattingFontSizeValue | null =
			numValue === defaultFontSize.value
				? null
				: { type: "px", value: numValue };

		uiPort.emitFormattingChange({ fontSize });
	};

	const sortedLetterSpacings = createMemo(() => {
		const deduplicatedValues: FormattingFontSizeValue[] = [];

		const commonValues = [...fontSizeValues, ...activeValues()];

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
		const contains = (value: FormattingFontSizeValue) => {
			return !![...activeValues()].find(
				(activeValue) =>
					activeValue.type === value.type && activeValue.value === value.value,
			);
		};

		return sortedLetterSpacings().map<DropdownList[number]>((fontSizeItem) => {
			return {
				checked: contains(fontSizeItem),
				text: `${fontSizeItem.value}`,
				button: {
					"on:click": () => {
						const defaultFontSize = uiPort.defaultFontSize;
						const fontSize: FormattingFontSizeValue | null =
							fontSizeItem.value === defaultFontSize.value
								? null
								: fontSizeItem;
						uiPort.emitFormattingChange({ fontSize });
					},
					class: "justify-center",
				},
			};
		});
	});

	const anchorName = "--font-size-anchor";

	return (
		<span style={{ "anchor-scope": anchorName }}>
			<TextFieldWrapper
				appearance="neutral-filled-underline"
				size="small"
				class="inline-block max-h-6.5 align-top"
				style={{ "anchor-name": anchorName }}
				postfix={
					<span class="relative inline-block size-2">
						<button
							type="button"
							popovertarget={popoverId}
							popovertargetaction="toggle"
							class="absolute -top-1 -left-1 rounded-xs p-1 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700"
							disabled={disabled()}
						>
							<Icon name="CaretDown" class="size-2" />
						</button>
					</span>
				}
			>
				<InputTextField
					type="text"
					class="max-w-10"
					disabled={disabled()}
					on:keydown={handleKeydown}
					on:blur={handleBlur}
					spellcheck={false}
					{...inputControls}
				/>
			</TextFieldWrapper>
			<Dropdown
				id={popoverId}
				list={list()}
				class="absolute [position-area:center_bottom]"
				style={{ "position-anchor": anchorName }}
			/>
		</span>
	);
};
