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
import { createTextFieldController, InputTextField } from "../InputFields";
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
				class="mt-1 w-[anchor-size(width)] rounded-md border border-neutral-200 p-1 shadow-md [position-area:span-right_bottom]"
			>
				<ul class="space-y-0.5">
					<For each={colorFormats}>
						{(item) => (
							<li>
								<button
									type="button"
									commandfor={popoverId}
									command="hide-popover"
									class="w-full rounded-xs border border-transparent px-2 py-1 text-start font-semibold text-neutral-700 text-xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 active:border-neutral-200"
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

	const [hexModel, hexControls] = createTextFieldController<HTMLInputElement>({
		defaultValue: getHexValue(props.hsl),
	});

	const [rgbRedModel, rgbRedControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getRgbValue(props.hsl).r,
		});

	const [rgbGreenModel, rgbGreenControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getRgbValue(props.hsl).g,
		});

	const [rgbBlueModel, rgbBlueControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getRgbValue(props.hsl).b,
		});

	const [hslHueModel, hslHueControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getHslValue(props.hsl).h,
		});

	const [hslSatModel, hslSatControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getHslValue(props.hsl).s,
		});

	const [hslLightModel, hslLightControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getHslValue(props.hsl).l,
		});

	const [alphaModel, alphaControls] =
		createTextFieldController<HTMLInputElement>({
			defaultValue: getAlphaInPercentage(props.hsl.a),
		});

	const updateHexValue = () => {
		const value = hexModel.value();

		if (!ColorFormat.hex({ hex: value }).isValid()) {
			hexModel.setValue(getHexValue(props.hsl));
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
		rgbRedModel.setValue(r);
		rgbGreenModel.setValue(g);
		rgbBlueModel.setValue(b);
	};

	const updateRgbValue = () => {
		const red = rgbRedModel.value();
		const green = rgbGreenModel.value();
		const blue = rgbBlueModel.value();

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

		hslHueModel.setValue(h);
		hslSatModel.setValue(s);
		hslLightModel.setValue(l);
	};

	const updateHslValue = () => {
		const hue = hslHueModel.value();
		const sat = hslSatModel.value();
		const light = hslLightModel.value();

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
		const value = alphaModel.value();

		if (!value) {
			alphaModel.setValue(`${Math.floor(props.hsl.a * 100)}`);
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
		hexModel.setValue(getHexValue(props.hsl));
		updateRgbInputs(props.hsl);
		updateHslInputs(props.hsl);
		alphaModel.setValue(getAlphaInPercentage(props.hsl.a));
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
				class="inline-flex rounded-sm border border-neutral-300 bg-neutral-100 font-semibold text-neutral-600 text-sm"
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
						<div class="content-center border-neutral-300 border-r">
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

						<div class="h-full content-center border-neutral-300 border-r">
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
						<div class="content-center border-neutral-300 border-r">
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

						<div class="h-full content-center border-neutral-300 border-r">
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

				<div class="inline-flex items-center border-neutral-300 border-l px-1">
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
