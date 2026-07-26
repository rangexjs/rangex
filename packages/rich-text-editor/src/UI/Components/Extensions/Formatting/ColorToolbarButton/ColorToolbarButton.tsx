import { createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import { ColorFormat, type HslFormat } from "../../../../Color";
import { useUIPortsContext } from "../../../App";
import {
	type ColorMode,
	ColorPanel,
	getColorMode,
	getDeduplicatedColors,
	getHslThemeColors,
	type OnActionFn,
} from "../../../ColorPanel";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

/**
 * Note: Gradient-colors are not supported yet.
 */
export const ColorToolbarButton = () => {
	const { formattingUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(uiPort.color.disabled);

	const popoverId = createUniqueId();
	let popover: HTMLDivElement | undefined;

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const initialHslColors = getHslThemeColors({ colors: uiPort.color.values });
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

	onMount(() => {
		const unsubscribe = uiPort.onColorUpdate((state) => {
			setDisabled(state.disabled);
			const hslColors = getHslThemeColors({ colors: state.values });
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
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onAction: OnActionFn = ({ type }) => {
		if (!popover) {
			throw new Error("Popover can't be undefined.");
		}

		popover.hidePopover();

		if (type === "cancel") {
			return;
		}

		if (type === "remove") {
			uiPort.emitFormattingChange({
				color: null,
			});
		}

		if (type === "apply") {
			uiPort.emitFormattingChange({
				color: {
					light: {
						type: "solid",
						value: ColorFormat.hsl(lightHsl()).color(),
					},
					dark: { type: "solid", value: ColorFormat.hsl(darkHsl()).color() },
				},
			});
		}
	};

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
				on:toggle={onPopoverToggle}
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
