import type { FontFamilyValue } from "@rangex/editor/formatting";
import { FontFamily, ReadOnly } from "@rangex/solid";
import { createEffect, createMemo, createUniqueId, untrack } from "solid-js";
import { useEditorContext, useUIOptionsContext } from "#context";
import {
	createTextFieldState,
	Icon,
	InputTextField,
	TextFieldWrapper,
} from "#ui";
import { ToolbarDropdown, type ToolbarDropdownList } from "../../_Utilities";

const getInputValueFromActiveValues = (
	fontFamily: Set<FontFamilyValue>,
	hasUnset: boolean,
): string => {
	if (fontFamily.size === 0) {
		return "";
	}

	if (fontFamily.size === 1 && !hasUnset) {
		const { value } = fontFamily.values().next();

		if (!value) {
			throw new Error("Value can't be undefined.");
		}

		return `${value}`;
	}

	return "Mixed";
};

export const FontFamilyToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;
	const uiOptions = useUIOptionsContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $fontFamily = FontFamily(formatting);
	const $readOnly = ReadOnly(readOnly);

	const fontFamilyOptions = uiOptions.formatting?.fontFamilyOptions;

	if (!fontFamilyOptions) {
		throw new Error("FontFamilyOptions can't be undefined.");
	}

	const fontFamilyValues = fontFamilyOptions.map((o) => o.value);

	const activeInputValue = createMemo(() =>
		getInputValueFromActiveValues($fontFamily.values(), $fontFamily.hasUnset()),
	);

	const [fontFamilyHandle, fontFamilyControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: untrack(() => activeInputValue()),
		});

	const popoverId = createUniqueId();

	createEffect(
		() => activeInputValue(),
		(value) => {
			fontFamilyHandle.setValue(value);
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

		if (!value) {
			formatting.setFontFamily(null);
			return;
		}

		const normalizedValue = fontFamilyValues.find(
			(fontFamily) => fontFamily.toLowerCase() === value.toLowerCase(),
		);

		if (!normalizedValue) {
			return;
		}

		fontFamilyHandle.setValue(normalizedValue);
		formatting.setFontFamily(normalizedValue);
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

		const activeValue = activeInputValue();

		if (!normalizedValue || normalizedValue === activeValue) {
			fontFamilyHandle.setValue(activeValue);
			return;
		}

		fontFamilyHandle.setValue(normalizedValue);
		formatting.setFontFamily(normalizedValue);
	};

	const list = createMemo<ToolbarDropdownList>(() => {
		const activeValues = $fontFamily.values();

		const getText = (value: FontFamilyValue) => {
			const option = fontFamilyOptions.find((o) => o.value === value);

			if (!option) {
				throw new Error("Option can't be undefined.");
			}

			return `${option.value} (${option.group})`;
		};

		const defaultItem: ToolbarDropdownList[number] = {
			checked: $fontFamily.hasUnset(),
			text: "Default",
			button: {
				onClick: () => formatting.setFontFamily(null),
			},
		};

		const fontFamilyItems = fontFamilyValues.map<ToolbarDropdownList[number]>(
			(fontFamilyItem) => {
				return {
					checked: activeValues.has(fontFamilyItem),
					text: getText(fontFamilyItem),
					button: {
						onClick: () => formatting.setFontFamily(fontFamilyItem),
					},
				};
			},
		);

		return [defaultItem, ...fontFamilyItems];
	});

	const disabled = createMemo(
		() => $fontFamily.disabled() || !!$readOnly?.checked(),
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
							<Icon
								name="CaretDown"
								title="Show font families"
								class="size-2"
							/>
						</button>
					</span>
				}
			>
				<InputTextField
					type="text"
					class="max-w-12"
					aria-label="Font family"
					placeholder="Font"
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
