import type { JSX } from "@solidjs/web";
import {
	type Accessor,
	createMemo,
	createSignal,
	createUniqueId,
	For,
	type Setter,
} from "solid-js";
import { ColorFormat, type HslFormat } from "#color";
import { isDeepEqual } from "#utilities";
import { SegmentedControl, type SegmentedControlControls } from "../_Utilities";
import { ColorTypeControls } from "../ColorTypeControls";
import { TransparentBackground } from "../ComplexSVGs";
import { Icon, type IconName } from "../Icon";
import { SpectrumColor } from "../SpectrumColor";
import { getGridPaletteColors } from "./_Utilities";

interface ColorPaletteProps {
	paletteColors: HslFormat[];
	paletteCols: number;
	onColorChange: (hsl: HslFormat) => void;
}

const ColorPalette = (props: ColorPaletteProps) => {
	return (
		<div
			class="grid justify-center gap-0.5"
			style={{
				"grid-template-columns": `repeat(${props.paletteCols}, 1fr)`,
			}}
		>
			<For each={props.paletteColors}>
				{(hsl) => {
					const backgroundColor = ColorFormat.hsl(hsl).color();
					const hex = ColorFormat.hsl(hsl).hex().hex;

					return (
						<button
							type="button"
							class="inline-block aspect-square scale-100 border-white outline-primary-500 transition-transform hover:z-10 hover:scale-110 hover:border-2 hover:outline-2 dark:border-neutral-900"
							style={{
								"background-color": backgroundColor,
							}}
							aria-label={hex}
							onClick={() => props.onColorChange(hsl)}
						/>
					);
				}}
			</For>
		</div>
	);
};

export type ColorMode = "light" | "dark" | "common";

const swatchAnchor = "--swatch-anchor";

interface ColorThemeButtonProps {
	theme: Extract<ColorMode, "light" | "dark">;
	themeHsl: Accessor<HslFormat>;
	setSpectrumHsl: Setter<HslFormat>;
	colorMode: Accessor<ColorMode>;
	setColorMode: Setter<ColorMode>;
}

const ColorThemeButton = (props: ColorThemeButtonProps) => {
	const text = { light: "Light", dark: "Dark" }[props.theme];

	const onThemeButtonClick = () => {
		props.setColorMode(props.theme);
		props.setSpectrumHsl(props.themeHsl());
	};

	return (
		<button
			type="button"
			class={[
				"inline-flex items-center gap-2 rounded-sm p-1 font-medium",
				{
					"btn-neutral-solid": props.colorMode() !== props.theme,
					"btn-primary-outline": props.colorMode() === props.theme,
				},
			]}
			aria-pressed={`${props.colorMode() === props.theme}`}
			onClick={() => onThemeButtonClick()}
		>
			<span>{text}</span>
			<span style={{ "anchor-scope": swatchAnchor }}>
				<TransparentBackground
					width="100%"
					height="100%"
					squareSize={6}
					class="size-5.5 rounded-sm"
					style={{ "anchor-name": swatchAnchor }}
				/>
				<span
					class="absolute size-6 rounded-sm"
					style={{
						"position-anchor": swatchAnchor,
						"position-area": "center",
						"background-color": ColorFormat.hsl(props.themeHsl()).color(),
					}}
				/>
			</span>
		</button>
	);
};

interface ColorModeButtonsProps {
	lightHsl: Accessor<HslFormat>;
	setLightHsl: Setter<HslFormat>;
	darkHsl: Accessor<HslFormat>;
	setDarkHsl: Setter<HslFormat>;
	setSpectrumHsl: Setter<HslFormat>;
	colorMode: Accessor<ColorMode>;
	setColorMode: Setter<ColorMode>;
}

const ColorModeButtons = (props: ColorModeButtonsProps) => {
	const iconName = createMemo<IconName>(() =>
		props.colorMode() === "common"
			? "LinkSimpleHorizontal"
			: "LinkSimpleHorizontalBreak",
	);

	const onMatchClick = () => {
		props.setColorMode((prev) => {
			if (prev !== "common") {
				const hsl = {
					light: props.lightHsl(),
					dark: props.darkHsl(),
				}[prev];

				props.setLightHsl(hsl);
				props.setDarkHsl(hsl);
				props.setSpectrumHsl(hsl);
			}

			return "common";
		});
	};

	return (
		<div class="flex items-center gap-2">
			<ColorThemeButton
				theme="light"
				themeHsl={props.lightHsl}
				setSpectrumHsl={props.setSpectrumHsl}
				colorMode={props.colorMode}
				setColorMode={props.setColorMode}
			/>
			<button
				type="button"
				class={[
					"rounded-sm px-1",
					{
						"btn-neutral-solid": props.colorMode() !== "common",
						"btn-primary-outline": props.colorMode() === "common",
					},
				]}
				onClick={onMatchClick}
				aria-label="Same color for light and dark"
				aria-pressed={`${props.colorMode() === "common"}`}
			>
				<Icon name={iconName()} class="size-4" />
			</button>
			<ColorThemeButton
				theme="dark"
				themeHsl={props.darkHsl}
				setSpectrumHsl={props.setSpectrumHsl}
				colorMode={props.colorMode}
				setColorMode={props.setColorMode}
			/>
		</div>
	);
};

type ContentId = "Grid" | "Spectrum";

interface OnActionParams {
	type: "apply" | "cancel" | "remove";
}

export type OnActionFn = (params: OnActionParams) => void;

interface ColorPanelProps {
	lightHsl: Accessor<HslFormat>;
	setLightHsl: Setter<HslFormat>;
	darkHsl: Accessor<HslFormat>;
	setDarkHsl: Setter<HslFormat>;
	spectrumHsl: Accessor<HslFormat>;
	setSpectrumHsl: Setter<HslFormat>;
	colorMode: Accessor<ColorMode>;
	setColorMode: Setter<ColorMode>;
	spectrumWidth: number;
	spectrumHeight: number;
	paletteCols: number;
	activeColors: HslFormat[];
	onAction: OnActionFn;
	class?: JSX.ClassValue;
}

export const ColorPanel = (props: ColorPanelProps) => {
	const [contentId, setContentId] = createSignal<ContentId>("Grid");
	const activeColorsLabelId = createUniqueId();

	const controls: SegmentedControlControls<ContentId> = [
		{ id: "Grid", node: "Grid" },
		{ id: "Spectrum", node: "Spectrum" },
	];

	const paletteRows = 11;

	const paletteColors = getGridPaletteColors({
		paletteRows,
		paletteCols: props.paletteCols,
	});

	const activeColorsRows = 3;

	const activeColors = createMemo(
		() => props.activeColors.slice(0, props.paletteCols * activeColorsRows),
		{ equals: isDeepEqual },
	);

	const onColorChange = (hsl: HslFormat) => {
		props.setSpectrumHsl(hsl);

		const colorMode = props.colorMode();

		if (colorMode === "light" || colorMode === "common") {
			props.setLightHsl(hsl);
		}

		if (colorMode === "dark" || colorMode === "common") {
			props.setDarkHsl(hsl);
		}
	};

	return (
		<div
			class={[props.class]}
			style={{ "max-width": `${props.spectrumWidth}px` }}
		>
			<SegmentedControl
				id={contentId()}
				controls={controls}
				onChange={(id) => setContentId(id)}
				label="Color picker mode"
				appearance="primary-outline"
				class="mb-4 rounded-sm"
				commonButtonClass="py-2 font-semibold text-sm"
			/>

			<div class="mb-3">
				<ColorModeButtons
					lightHsl={props.lightHsl}
					setLightHsl={props.setLightHsl}
					darkHsl={props.darkHsl}
					setDarkHsl={props.setDarkHsl}
					setSpectrumHsl={props.setSpectrumHsl}
					colorMode={props.colorMode}
					setColorMode={props.setColorMode}
				/>
			</div>

			<div style={{ width: `${props.spectrumWidth}px` }}>
				<div class={[{ hidden: contentId() !== "Spectrum" }]}>
					<SpectrumColor
						hsl={props.spectrumHsl()}
						onColorChange={({ hsl }) => {
							onColorChange(hsl);
						}}
						spectrumWidth={props.spectrumWidth}
						spectrumHeight={props.spectrumHeight}
					/>

					<ColorTypeControls
						hsl={props.spectrumHsl()}
						onColorChange={({ hsl }) => {
							onColorChange(hsl);
						}}
					/>
				</div>

				<div class={[{ hidden: contentId() !== "Grid" }]}>
					<ColorPalette
						paletteColors={paletteColors}
						paletteCols={props.paletteCols}
						onColorChange={(hsl) => {
							onColorChange(hsl);
						}}
					/>
				</div>
			</div>

			<div class="mt-6 flex justify-between">
				<button
					type="button"
					class="btn-neutral-solid inline-flex min-w-20 items-center gap-2 rounded-sm px-2 py-1 font-medium text-sm"
					onClick={() => props.onAction({ type: "remove" })}
				>
					<Icon name="Trash" class="size-4" />
					<span>Remove</span>
				</button>
				<div class="flex gap-2">
					<button
						type="button"
						class="btn-neutral-solid min-w-20 rounded-sm px-2 py-1 font-medium text-sm"
						onClick={() => props.onAction({ type: "cancel" })}
					>
						Cancel
					</button>
					<button
						type="button"
						class="btn-primary-solid min-w-20 rounded-sm px-2 py-1 font-medium text-sm"
						onClick={() => props.onAction({ type: "apply" })}
					>
						Apply
					</button>
				</div>
			</div>

			<div class={["mt-2", { hidden: !props.activeColors.length }]}>
				<hr class="mb-2 h-0.5 rounded-sm border-0 bg-neutral-300 dark:bg-neutral-700" />
				<div
					id={activeColorsLabelId}
					class="mb-1 font-medium text-neutral-600 text-sm [text-box:trim-start_cap_alphabetic] dark:text-neutral-300"
				>
					Active colors
				</div>
				<fieldset
					aria-labelledby={activeColorsLabelId}
					class="grid min-w-0 gap-0.5"
					style={{
						"grid-template-columns": `repeat(${props.paletteCols}, 1fr)`,
					}}
				>
					<For each={activeColors()}>
						{(hsl) => {
							const backgroundColor = ColorFormat.hsl(hsl).color();
							const hex = ColorFormat.hsl(hsl).hex().hex;

							return (
								<button
									type="button"
									class="inline-block aspect-square scale-100 border-white outline-primary-500 transition-transform hover:z-10 hover:scale-110 hover:border-2 hover:outline-2 dark:border-neutral-900"
									style={{ "background-color": backgroundColor }}
									aria-label={hex}
									onClick={() => {
										onColorChange(hsl);
									}}
								/>
							);
						}}
					</For>
				</fieldset>
			</div>
		</div>
	);
};
