import {
	type Accessor,
	createEffect,
	createSignal,
	createUniqueId,
	For,
	type Setter,
} from "solid-js";
import { ColorFormat, type HslFormat } from "../../Color";
import { Icon } from "../Icon";
import { createTextFieldState, InputTextField } from "../InputFields";
import type {
	ColorType,
	ColorTypeControlsParams,
} from "./ColorTypeControls-type";

const getHexValue = (hsl: HslFormat) => {
	return ColorFormat.hsl(hsl).hex().hex.slice(1, 7);
};

const getRgbValue = (hsl: HslFormat) => {
	const { r, g, b } = ColorFormat.hsl(hsl).rgb({ round: true });

	return { r: `${r}`, g: `${g}`, b: `${b}` };
};

const getHslValue = (hsl: HslFormat) => {
	const { h, s, l } = ColorFormat.roundHsl(hsl);

	return { h: `${h}`, s: `${s}`, l: `${l}` };
};

const getAlphaInPercentage = (alpha: number) => {
	return `${Math.floor(alpha * 100)}`;
};

interface ColorFormatButtonProps {
	colorFormat: Accessor<ColorType>;
	setColorFormat: Setter<ColorType>;
	class?: string;
}

const ColorFormatButton = (props: ColorFormatButtonProps) => {
	const popoverId = createUniqueId();

	const colorFormats: ColorType[] = ["Hex", "RGB", "HSL"];

	return (
		<div classList={{ [props.class ?? ""]: true }}>
			<button
				type="button"
				commandfor={popoverId}
				command="toggle-popover"
				class="btn-neutral-solid flex w-16 items-center justify-between rounded-sm px-2 py-1 font-semibold text-sm"
			>
				<span>{props.colorFormat()}</span>
				<Icon name="CaretDown" class="size-2" />
			</button>
			<div
				id={popoverId}
				popover="auto"
				class="mt-1 w-[anchor-size(width)] rounded-md border border-neutral-200 bg-white p-1 shadow-md [position-area:span-right_bottom] dark:border-neutral-700 dark:bg-neutral-900"
			>
				<ul class="space-y-0.5">
					<For each={colorFormats}>
						{(item) => (
							<li>
								<button
									type="button"
									commandfor={popoverId}
									command="hide-popover"
									class="w-full rounded-xs border border-transparent px-2 py-1 text-start font-semibold text-neutral-700 text-xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 active:border-neutral-200 dark:text-neutral-200 dark:active:border-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
									classList={{ hidden: item === props.colorFormat() }}
									on:click={() => props.setColorFormat(item)}
								>
									{item}
								</button>
							</li>
						)}
					</For>
				</ul>
			</div>
		</div>
	);
};

export const ColorTypeControls = (props: ColorTypeControlsParams) => {
	const [colorType, setColorType] = createSignal<ColorType>("Hex");

	const [hexHandle, hexControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: getHexValue(props.hsl),
	});

	const [rgbRedHandle, rgbRedControls] = createTextFieldState<HTMLInputElement>(
		{
			defaultValue: getRgbValue(props.hsl).r,
		},
	);

	const [rgbGreenHandle, rgbGreenControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: getRgbValue(props.hsl).g,
		});

	const [rgbBlueHandle, rgbBlueControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: getRgbValue(props.hsl).b,
		});

	const [hslHueHandle, hslHueControls] = createTextFieldState<HTMLInputElement>(
		{
			defaultValue: getHslValue(props.hsl).h,
		},
	);

	const [hslSatHandle, hslSatControls] = createTextFieldState<HTMLInputElement>(
		{
			defaultValue: getHslValue(props.hsl).s,
		},
	);

	const [hslLightHandle, hslLightControls] =
		createTextFieldState<HTMLInputElement>({
			defaultValue: getHslValue(props.hsl).l,
		});

	const [alphaHandle, alphaControls] = createTextFieldState<HTMLInputElement>({
		defaultValue: getAlphaInPercentage(props.hsl.a),
	});

	const updateHexValue = () => {
		const value = hexHandle.value();

		if (!ColorFormat.hex({ hex: value }).isValid()) {
			hexHandle.setValue(getHexValue(props.hsl));
			return;
		}

		const hsl = ColorFormat.hex({ hex: value }).hsl({});
		props.onColorChange({ hsl: { ...hsl, a: props.hsl.a } });
	};

	const handleHexKeydown = (event: KeyboardEvent) => {
		if (event.code === "Enter") {
			updateHexValue();
		}
	};

	const handleHexBlur = () => {
		updateHexValue();
	};

	const handleRgbBeforeInput = (event: InputEvent) => {
		const { inputType, data } = event;

		if (inputType !== "insertText" && inputType !== "insertFromPaste") {
			return;
		}

		if (!data || /[^\d]/.test(data)) {
			event.preventDefault();
		}
	};

	const updateRgbInputs = (hsl: HslFormat) => {
		const { r, g, b } = getRgbValue(hsl);
		rgbRedHandle.setValue(r);
		rgbGreenHandle.setValue(g);
		rgbBlueHandle.setValue(b);
	};

	const updateRgbValue = () => {
		const red = rgbRedHandle.value();
		const green = rgbGreenHandle.value();
		const blue = rgbBlueHandle.value();

		if (!(red && green && blue)) {
			updateRgbInputs(props.hsl);
			return;
		}

		const rgb = ColorFormat.normalizeRgb({
			r: +red,
			g: +green,
			b: +blue,
			a: props.hsl.a,
		});

		if (!ColorFormat.rgb(rgb).isValid()) {
			updateRgbInputs(props.hsl);
			return;
		}

		const hsl = ColorFormat.rgb(rgb).hsl({});
		props.onColorChange({ hsl });
	};

	const handleRgbKeydown = (event: KeyboardEvent) => {
		if (event.code === "Enter") {
			updateRgbValue();
		}
	};

	const handleRgbBlur = () => {
		updateRgbValue();
	};

	const handleHslBeforeInput = (event: InputEvent) => {
		const { inputType, data } = event;

		if (inputType !== "insertText" && inputType !== "insertFromPaste") {
			return;
		}

		if (!data || /[^\d]/.test(data)) {
			event.preventDefault();
		}
	};

	const updateHslInputs = (hsl: HslFormat) => {
		const { h, s, l } = getHslValue(hsl);

		hslHueHandle.setValue(h);
		hslSatHandle.setValue(s);
		hslLightHandle.setValue(l);
	};

	const updateHslValue = () => {
		const hue = hslHueHandle.value();
		const sat = hslSatHandle.value();
		const light = hslLightHandle.value();

		if (!(hue && sat && light)) {
			updateHslInputs(props.hsl);
			return;
		}

		const hsl = ColorFormat.normalizeHsl({
			h: +hue,
			s: +sat,
			l: +light,
			a: props.hsl.a,
		});

		if (!ColorFormat.hsl(hsl).isValid()) {
			updateHslInputs(props.hsl);
			return;
		}

		props.onColorChange({ hsl });
	};

	const handleHslKeydown = (event: KeyboardEvent) => {
		if (event.code === "Enter") {
			updateHslValue();
		}
	};

	const handleHslBlur = () => {
		updateHslValue();
	};

	const handleAlphaBeforeInput = (event: InputEvent) => {
		const { inputType, data } = event;

		if (inputType !== "insertText" && inputType !== "insertFromPaste") {
			return;
		}

		if (!data || /[^\d]/.test(data)) {
			event.preventDefault();
		}
	};

	const updateAlphaValue = () => {
		const value = alphaHandle.value();

		if (!value) {
			alphaHandle.setValue(`${Math.floor(props.hsl.a * 100)}`);
			return;
		}

		const normalizedValue = Math.max(0, Math.min(100, +value)) / 100;

		props.onColorChange({ hsl: { ...props.hsl, a: normalizedValue } });
	};

	const handleAlphaKeydown = (event: KeyboardEvent) => {
		if (event.code === "Enter") {
			updateAlphaValue();
		}
	};

	const handleAlphaBlur = () => {
		updateAlphaValue();
	};

	createEffect(() => {
		hexHandle.setValue(getHexValue(props.hsl));
		updateRgbInputs(props.hsl);
		updateHslInputs(props.hsl);
		alphaHandle.setValue(getAlphaInPercentage(props.hsl.a));
	});

	const copyColorToClipboard = async () => {
		try {
			const text = {
				Hex: () => {
					return ColorFormat.hsl(props.hsl).hex().hex;
				},
				RGB: () => {
					const { r, g, b, a } = ColorFormat.hsl(props.hsl).rgb({
						round: true,
					});

					return `rgba(${r}, ${g}, ${b}, ${a})`;
				},
				HSL: () => {
					const { h, s, l, a } = ColorFormat.roundHsl(props.hsl);

					return `hsla(${h}, ${s}, ${l}, ${a})`;
				},
			}[colorType()]();

			await navigator.clipboard.writeText(text);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div class="flex gap-2">
			<ColorFormatButton
				colorFormat={colorType}
				setColorFormat={setColorType}
				class={props.buttonContainerClass}
			/>

			<div
				class="inline-flex rounded-sm border border-neutral-300 bg-neutral-100 font-semibold text-neutral-600 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
				classList={{ [props.colorContainerClass ?? ""]: true }}
			>
				<div class="w-full">
					<div
						class="h-full content-center"
						classList={{ hidden: colorType() !== "Hex" }}
					>
						<InputTextField
							type="text"
							class="w-full text-center outline-none"
							on:keydown={handleHexKeydown}
							on:blur={handleHexBlur}
							spellcheck={false}
							{...hexControls}
						/>
					</div>

					<div
						class="flex h-full"
						classList={{ hidden: colorType() !== "RGB" }}
					>
						<div class="content-center border-neutral-300 border-r dark:border-neutral-600">
							<InputTextField
								type="text"
								class="w-full text-center outline-none"
								on:beforeinput={handleRgbBeforeInput}
								on:keydown={handleRgbKeydown}
								on:blur={handleRgbBlur}
								spellcheck={false}
								{...rgbRedControls}
							/>
						</div>

						<div class="h-full content-center border-neutral-300 border-r dark:border-neutral-600">
							<InputTextField
								type="text"
								class="w-full text-center outline-none"
								on:beforeinput={handleRgbBeforeInput}
								on:keydown={handleRgbKeydown}
								on:blur={handleRgbBlur}
								spellcheck={false}
								{...rgbGreenControls}
							/>
						</div>

						<div class="h-full content-center">
							<InputTextField
								type="text"
								class="w-full text-center outline-none"
								on:beforeinput={handleRgbBeforeInput}
								on:keydown={handleRgbKeydown}
								on:blur={handleRgbBlur}
								spellcheck={false}
								{...rgbBlueControls}
							/>
						</div>
					</div>

					<div
						class="flex h-full"
						classList={{ hidden: colorType() !== "HSL" }}
					>
						<div class="content-center border-neutral-300 border-r dark:border-neutral-600">
							<InputTextField
								type="text"
								class="w-full text-center outline-none"
								on:beforeinput={handleHslBeforeInput}
								on:keydown={handleHslKeydown}
								on:blur={handleHslBlur}
								spellcheck={false}
								{...hslHueControls}
							/>
						</div>

						<div class="h-full content-center border-neutral-300 border-r dark:border-neutral-600">
							<InputTextField
								type="text"
								class="w-full text-center outline-none"
								on:beforeinput={handleHslBeforeInput}
								on:keydown={handleHslKeydown}
								on:blur={handleHslBlur}
								spellcheck={false}
								{...hslSatControls}
							/>
						</div>

						<div class="h-full content-center">
							<InputTextField
								type="text"
								class="w-full text-center outline-none"
								on:beforeinput={handleHslBeforeInput}
								on:keydown={handleHslKeydown}
								on:blur={handleHslBlur}
								spellcheck={false}
								{...hslLightControls}
							/>
						</div>
					</div>
				</div>

				<div class="inline-flex items-center border-neutral-300 border-l px-1 dark:border-neutral-600">
					<InputTextField
						type="text"
						class="w-8 text-center outline-none"
						maxLength="3"
						on:beforeinput={handleAlphaBeforeInput}
						on:keydown={handleAlphaKeydown}
						on:blur={handleAlphaBlur}
						spellcheck={false}
						{...alphaControls}
					/>
					<span>%</span>
				</div>
			</div>

			<button
				type="button"
				class="btn-neutral-solid rounded-sm px-1.5"
				on:click={() => copyColorToClipboard()}
			>
				<Icon name="CopySimple" class="size-4" />
			</button>
		</div>
	);
};
