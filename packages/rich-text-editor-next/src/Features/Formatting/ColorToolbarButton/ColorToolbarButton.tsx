import { Color, ReadOnly } from "@rangex/solid";
import {
	createEffect,
	createMemo,
	createSignal,
	createUniqueId,
} from "solid-js";
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
export const ColorToolbarButton = () => {
	const { formatting, readOnly } = useEditorContext();

	if (!formatting) {
		throw new Error("Formatting can't be undefined.");
	}

	const $color = Color(formatting);
	const $readOnly = ReadOnly(readOnly);

	const [checked, setChecked] = createSignal(false);

	const popoverId = createUniqueId();
	let popover: HTMLDivElement | undefined;

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const initialHslColors = getHslThemeColors({
		colors: $color.values(),
	});
	const initialColorMode = getColorMode(initialHslColors);

	const [lightHsl, setLightHsl] = createSignal<HslFormat>(
		initialHslColors.lightColors.at(0) ??
			ColorFormat.fromColor({ color: "black" }).hslFormat(),
	);
	const [darkHsl, setDarkHsl] = createSignal<HslFormat>(
		initialHslColors.darkColors.at(0) ??
			ColorFormat.fromColor({ color: "white" }).hslFormat(),
	);
	const [spectrumHsl, setSpectrumHsl] = createSignal<HslFormat>(lightHsl());
	const [colorMode, setColorMode] = createSignal<ColorMode>(initialColorMode);
	const initialActiveColors = getDeduplicatedColors([
		...initialHslColors.lightColors,
		...initialHslColors.darkColors,
	]);
	const [activeColors, setActiveColors] = createSignal(initialActiveColors);

	createEffect(
		() => $color.values(),
		(values) => {
			const hslColors = getHslThemeColors({ colors: values });
			const colorMode = getColorMode(hslColors);

			setColorMode(colorMode);
			setLightHsl(
				hslColors.lightColors.at(0) ??
					ColorFormat.fromColor({ color: "black" }).hslFormat(),
			);
			setDarkHsl(
				hslColors.darkColors.at(0) ??
					ColorFormat.fromColor({ color: "white" }).hslFormat(),
			);
			setSpectrumHsl(
				hslColors.lightColors.at(0) ??
					ColorFormat.fromColor({ color: "black" }).hslFormat(),
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
			formatting.setColor(null);
		}

		if (type === "apply") {
			formatting.setColor({
				light: {
					type: "solid",
					value: ColorFormat.hsl(lightHsl()).color(),
				},
				dark: { type: "solid", value: ColorFormat.hsl(darkHsl()).color() },
			});
		}
	};

	const disabled = createMemo(
		() => $color.disabled() || !!$readOnly?.checked(),
	);

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				hasChevron={true}
				commandfor={popoverId}
				command="toggle-popover"
			>
				<Icon name="Palette" class="size-4" />
			</ToolbarButton>
			<div
				id={popoverId}
				ref={popover}
				popover="auto"
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
