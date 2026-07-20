import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { FormattingFontFamilyValue, FormattingUIPort } from "#adapters";
import { useEditorOptionsContext } from "../../../App";
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

interface FontFamilyToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const FontFamilyToolbarButton = (
	props: FontFamilyToolbarButtonProps,
) => {
	const uiPort = props.uiPort;
	const { fontFamilyOptions } = useEditorOptionsContext();
	const fontFamilyValues = fontFamilyOptions.map((o) => o.value);

	const [disabled, setDisabled] = createSignal(uiPort.fontFamily.disabled);
	const [activeValues, setActiveValues] = createSignal(
		uiPort.fontFamily.values,
	);
	const [inputModel, inputControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getInputValueFromActiveValues(
				activeValues(),
				uiPort.defaultFontFamily,
			),
		});

	const popoverId = createUniqueId();

	onMount(() => {
		const unsubscribe = uiPort.onFontFamilyUpdate((state) => {
			setDisabled(state.disabled);
			setActiveValues(state.values);
			inputModel.setValue(
				getInputValueFromActiveValues(state.values, uiPort.defaultFontFamily),
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

		const normalizedValue = fontFamilyValues.find(
			(fontFamily) => fontFamily.toLowerCase() === value.toLowerCase(),
		);

		if (!normalizedValue) {
			return;
		}

		inputModel.setValue(normalizedValue);

		const fontFamily: FormattingFontFamilyValue | null =
			normalizedValue === uiPort.defaultFontFamily ? null : normalizedValue;

		uiPort.emitFormattingChange({ fontFamily });
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
			uiPort.defaultFontFamily,
		);

		if (!normalizedValue || normalizedValue === activeValue) {
			inputModel.setValue(activeValue);
			return;
		}

		inputModel.setValue(normalizedValue);

		const fontFamily: FormattingFontFamilyValue | null =
			normalizedValue === uiPort.defaultFontFamily ? null : normalizedValue;

		uiPort.emitFormattingChange({ fontFamily });
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
							fontFamilyItem === uiPort.defaultFontFamily
								? null
								: fontFamilyItem;
						uiPort.emitFormattingChange({ fontFamily });
					},
				},
			};
		});
	});

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
