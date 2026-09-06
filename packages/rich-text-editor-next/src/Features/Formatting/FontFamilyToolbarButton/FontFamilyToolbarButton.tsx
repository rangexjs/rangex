import type { FormattingFontFamilyValue } from "@rangex/editor";
import { createEffect, createMemo, createUniqueId } from "solid-js";
import { useEditorContext } from "#context";
import {
	createTextFieldState,
	Icon,
	InputTextField,
	TextFieldWrapper,
} from "#ui";
import { ToolbarDropdown, type ToolbarDropdownList } from "../../_Utilities";

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
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const fontFamilyOptions = formatting.fontFamilyOptions;
	const fontFamilyValues = fontFamilyOptions.map((o) => o.value);

	const [fontFamilyHandle, fontFamilyControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: getInputValueFromActiveValues(
				formatting.fontFamily().values,
				formatting.defaultFontFamily,
			),
		});

	const popoverId = createUniqueId();

	createEffect(
		() => formatting.fontFamily().values,
		(values) => {
			fontFamilyHandle.setValue(
				getInputValueFromActiveValues(values, formatting.defaultFontFamily),
			);
		},
	);

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

		fontFamilyHandle.setValue(normalizedValue);

		const fontFamily: FormattingFontFamilyValue | null =
			normalizedValue === formatting.defaultFontFamily ? null : normalizedValue;

		formatting.setFontFamily(fontFamily);
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
			formatting.fontFamily().values,
			formatting.defaultFontFamily,
		);

		if (!normalizedValue || normalizedValue === activeValue) {
			fontFamilyHandle.setValue(activeValue);
			return;
		}

		fontFamilyHandle.setValue(normalizedValue);

		const fontFamily: FormattingFontFamilyValue | null =
			normalizedValue === formatting.defaultFontFamily ? null : normalizedValue;

		formatting.setFontFamily(fontFamily);
	};

	const list = createMemo<ToolbarDropdownList>(() => {
		const activeValues = formatting.fontFamily().values;

		const getText = (value: FormattingFontFamilyValue) => {
			const option = fontFamilyOptions.find((o) => o.value === value);

			if (!option) {
				throw new Error("Option can't be undefined.");
			}

			return `${option.value} (${option.group})`;
		};

		return fontFamilyValues.map((fontFamilyItem) => {
			return {
				checked: activeValues.has(fontFamilyItem),
				text: getText(fontFamilyItem),
				button: {
					onClick: () => {
						const fontFamily: FormattingFontFamilyValue | null =
							fontFamilyItem === formatting.defaultFontFamily
								? null
								: fontFamilyItem;
						formatting.setFontFamily(fontFamily);
					},
				},
			};
		});
	});

	const disabled = createMemo(
		() => formatting.fontFamily().disabled || !!readOnly?.checked(),
	);

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
					onKeyDown={handleKeydown}
					onBlur={handleBlur}
					spellcheck={false}
					{...fontFamilyControls}
				/>
			</TextFieldWrapper>
			<ToolbarDropdown
				id={popoverId}
				list={list()}
				class="absolute [position-area:center_bottom]"
				style={{ "position-anchor": anchorName }}
			/>
		</span>
	);
};
