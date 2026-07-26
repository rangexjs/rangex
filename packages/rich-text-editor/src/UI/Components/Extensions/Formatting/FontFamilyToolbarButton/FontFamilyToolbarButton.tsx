import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingFontFamilyValue } from "#adapters";
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

const getInputValueFromActiveValues = (
	fontFamily: Set<FormattingFontFamilyValue>,
	defaultValue: FormattingFontFamilyValue,
): string => {
	if (fontFamily.size === 0) {
		return `${defaultValue}`;
	}

	if (fontFamily.size === 1) {
		const { value } = fontFamily.values().next();

		if (!value) {
			throw new Error("Value can't be undefined.");
		}

		return `${value}`;
	}

	return "Mixed";
};

export const FontFamilyToolbarButton = () => {
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}
	const fontFamilyOptions = formattingUIPort.fontFamilyOptions;
	const fontFamilyValues = fontFamilyOptions.map((o) => o.value);

	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.fontFamily.disabled,
	);
	const [activeValues, setActiveValues] = createSignal(
		formattingUIPort.fontFamily.values,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);
	const [inputModel, inputControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getInputValueFromActiveValues(
				activeValues(),
				formattingUIPort.defaultFontFamily,
			),
		});

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribeFontFamily = formattingUIPort.onFontFamilyUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
				setActiveValues(state.values);
				inputModel.setValue(
					getInputValueFromActiveValues(
						state.values,
						formattingUIPort.defaultFontFamily,
					),
				);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeFontFamily();
			unsubscribeReadOnly?.();
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

		const normalizedValue = fontFamilyValues.find(
			(fontFamily) => fontFamily.toLowerCase() === value.toLowerCase(),
		);

		if (!normalizedValue) {
			return;
		}

		inputModel.setValue(normalizedValue);

		const fontFamily: FormattingFontFamilyValue | null =
			normalizedValue === formattingUIPort.defaultFontFamily
				? null
				: normalizedValue;

		formattingUIPort.emitFormattingChange({ fontFamily });
	};

	const handleBlur = (event: FocusEvent) => {
		const { currentTarget } = event;

		if (!(currentTarget instanceof HTMLInputElement)) {
			throw new Error("CurrentTarget's type is invalid.");
		}

		const { value } = currentTarget;

		const normalizedValue = fontFamilyValues.find(
			(fontFamily) => fontFamily.toLowerCase() === value.toLowerCase(),
		);

		const activeValue = getInputValueFromActiveValues(
			activeValues(),
			formattingUIPort.defaultFontFamily,
		);

		if (!normalizedValue || normalizedValue === activeValue) {
			inputModel.setValue(activeValue);
			return;
		}

		inputModel.setValue(normalizedValue);

		const fontFamily: FormattingFontFamilyValue | null =
			normalizedValue === formattingUIPort.defaultFontFamily
				? null
				: normalizedValue;

		formattingUIPort.emitFormattingChange({ fontFamily });
	};

	const list = createMemo<DropdownList>(() => {
		const getText = (value: FormattingFontFamilyValue) => {
			const option = fontFamilyOptions.find((o) => o.value === value);

			if (!option) {
				throw new Error("Option can't be undefined.");
			}

			return `${option.value} (${option.group})`;
		};

		return fontFamilyValues.map((fontFamilyItem) => {
			return {
				checked: activeValues().has(fontFamilyItem),
				text: getText(fontFamilyItem),
				button: {
					"on:click": () => {
						const fontFamily: FormattingFontFamilyValue | null =
							fontFamilyItem === formattingUIPort.defaultFontFamily
								? null
								: fontFamilyItem;
						formattingUIPort.emitFormattingChange({ fontFamily });
					},
				},
			};
		});
	});

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	const anchorName = "--font-family-anchor";

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
