import { BackgroundColor, ReadOnly } from "@rangex/solid";
import { createEffect, createMemo, createSignal, createUniqueId, untrack } from "solid-js";

import { ColorFormat, type HslFormat } from "#color";
import { useEditorContext } from "#context";
import {
	type ColorMode,
	ColorPanel,
	getColorMode,
	getDeduplicatedColors,
	getHslThemeColors,
	Icon,
	type OnActionFn,
} from "#ui";

import { ToolbarButton } from "../../_Utilities";

/**
 * Note: Gradient-colors are not supported yet.
 */
export const BackgroundColorToolbarButton = () => {
	const editor = useEditorContext();
	const { formatting, readOnly } = editor;

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $backgroundColor = BackgroundColor(formatting);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();
	let popover: HTMLDivElement | undefined;

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const initialHslColors = untrack(() => getHslThemeColors({ colors: $backgroundColor.values() }));
	const initialColorMode = getColorMode(initialHslColors);

	const [lightHsl, setLightHsl] = createSignal<HslFormat>(
		initialHslColors.lightColors.at(0) ?? ColorFormat.fromColor({ color: "white" }).hslFormat(),
	);
	const [darkHsl, setDarkHsl] = createSignal<HslFormat>(
		initialHslColors.darkColors.at(0) ?? ColorFormat.fromColor({ color: "black" }).hslFormat(),
	);
	const [spectrumHsl, setSpectrumHsl] = createSignal<HslFormat>(untrack(() => lightHsl()));
	const [colorMode, setColorMode] = createSignal<ColorMode>(initialColorMode);
	const initialActiveColors = getDeduplicatedColors([
		...initialHslColors.lightColors,
		...initialHslColors.darkColors,
	]);
	const [activeColors, setActiveColors] = createSignal(initialActiveColors);

	createEffect(
		() => $backgroundColor.values(),
		(values) => {
			const hslColors = getHslThemeColors({ colors: values });
			const colorMode = getColorMode(hslColors);

			setColorMode(colorMode);
			setLightHsl(
				hslColors.lightColors.at(0) ?? ColorFormat.fromColor({ color: "white" }).hslFormat(),
			);
			setDarkHsl(
				hslColors.darkColors.at(0) ?? ColorFormat.fromColor({ color: "black" }).hslFormat(),
			);
			setSpectrumHsl(
				hslColors.lightColors.at(0) ?? ColorFormat.fromColor({ color: "white" }).hslFormat(),
			);

			const activeColors = getDeduplicatedColors([
				...hslColors.lightColors,
				...hslColors.darkColors,
			]);

			setActiveColors(activeColors);
		},
	);

	const onAction: OnActionFn = ({ type }) => {
		if (!popover) {
			throw new Error("Popover can't be undefined.");
		}

		popover.hidePopover();

		if (type === "cancel") {
			return;
		}

		if (type === "remove") {
			formatting.setBackgroundColor(null);
		}

		if (type === "apply") {
			formatting.setBackgroundColor({
				light: {
					type: "solid",
					value: ColorFormat.hsl(lightHsl()).hex().hex,
				},
				dark: { type: "solid", value: ColorFormat.hsl(darkHsl()).hex().hex },
			});
		}
	};

	const disabled = createMemo(() => $backgroundColor.disabled() || !!$readOnly?.checked());

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="PaintBucket" title="Background color" class="size-4" />
			</ToolbarButton>
			<div
				id={popoverId}
				ref={popover}
				popover="auto"
				role="dialog"
				aria-label="Background color"
				onToggle={onPopoverToggle}
				class="mt-1 overflow-x-clip rounded-md border border-neutral-200 bg-white p-2 shadow-md [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
			>
				<ColorPanel
					lightHsl={lightHsl}
					setLightHsl={setLightHsl}
					darkHsl={darkHsl}
					setDarkHsl={setDarkHsl}
					spectrumHsl={spectrumHsl}
					setSpectrumHsl={setSpectrumHsl}
					colorMode={colorMode}
					setColorMode={setColorMode}
					spectrumWidth={300}
					spectrumHeight={150}
					paletteCols={11}
					activeColors={activeColors()}
					onAction={onAction}
				/>
			</div>
		</span>
	);
};
