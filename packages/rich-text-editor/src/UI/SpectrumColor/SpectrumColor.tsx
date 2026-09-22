import { createEffect, createMemo, createSignal } from "solid-js";
import { ColorFormat } from "../../Color";
import { TransparentBackground } from "../ComplexSVGs";
import { type OnThumbChangeFn, type RenderChildrenFn, Slider } from "../Slider";
import type {
	GetAlphaThumbPositionProps,
	GetHorizontalThumbPositionProps,
	GetHueThumbPositionProps,
	GetPositionFromSaturationLightnessProps,
	GetPositionFromSaturationLightnessReturn,
	GetSaturationLightnessFromPositionProps,
	GetSaturationLightnessFromPositionReturn,
	GetThumbPositionInPercentageProps,
	GetThumbPositionInPercentageReturn,
	GetVerticalThumbPositionProps,
	ManageColorUpdateProps,
	ManageThumbUpdateProps,
	SpectrumColorProps,
	ThumbPosition,
} from "./SpectrumColor-types";

const getPositionFromSaturationLightness = ({
	saturation,
	lightness,
}: GetPositionFromSaturationLightnessProps): GetPositionFromSaturationLightnessReturn => {
	const s = saturation / 100;
	const l = lightness / 100;

	const lightFactor = s * (l < 0.5 ? l : 1 - l);

	const xPosition =
		(lightFactor === 0 ? 0 : (2 * lightFactor) / (l + lightFactor)) * 100;

	const yPosition = (l + lightFactor) * 100;

	return { xPosition, yPosition };
};

const getHueThumbPosition = ({ hue }: GetHueThumbPositionProps) =>
	Math.round((hue / 359) * 100);

const getAlphaThumbPosition = ({ alpha }: GetAlphaThumbPositionProps) =>
	Math.round(alpha * 100);

const getHorizontalThumbPosition = ({
	clientX,
	panelLeft,
	panelRight,
	panelWidth,
}: GetHorizontalThumbPositionProps) => {
	if (clientX <= panelLeft) {
		return 0;
	}

	if (clientX >= panelRight) {
		return 100;
	}

	const thumbPosition = clientX - panelLeft;

	const positionInPercentage = (thumbPosition / panelWidth) * 100;

	return positionInPercentage;
};

const getVerticalThumbPosition = ({
	clientY,
	panelTop,
	panelBottom,
	panelHeight,
}: GetVerticalThumbPositionProps) => {
	if (clientY <= panelTop) {
		return 100;
	}

	if (clientY >= panelBottom) {
		return 0;
	}

	const thumbPosition = panelBottom - clientY;

	const positionInPercentage = (thumbPosition / panelHeight) * 100;

	return positionInPercentage;
};

/**
 * Gets the position in percentage for the css anchor() function.
 *
 * It calculates the position based on the {@link sliderTrack}'s bounds and the client(X|Y).
 */
const getThumbPositionInPercentage = ({
	panel,
	clientX,
	clientY,
}: GetThumbPositionInPercentageProps): GetThumbPositionInPercentageReturn => {
	const { bottom, height, left, right, top, width } =
		panel.getBoundingClientRect();

	const xPosition = getHorizontalThumbPosition({
		clientX,
		panelLeft: left,
		panelRight: right,
		panelWidth: width,
	});

	const yPosition = getVerticalThumbPosition({
		clientY,
		panelTop: top,
		panelBottom: bottom,
		panelHeight: height,
	});

	return { xPosition, yPosition };
};

const getSaturationLightnessFromPosition = ({
	xPosition,
	yPosition,
}: GetSaturationLightnessFromPositionProps): GetSaturationLightnessFromPositionReturn => {
	const xPercentage = xPosition / 100;
	const yPercentage = yPosition / 100;

	const lightnessScale = (2 - xPercentage) * yPercentage;

	const lightness = (lightnessScale / 2) * 100;

	if (xPercentage === 0 || yPercentage === 0) {
		return { saturation: 0, lightness };
	}

	const saturation =
		((xPercentage * yPercentage) /
			(lightnessScale < 1 ? lightnessScale : 2 - lightnessScale)) *
		100;

	return { saturation, lightness };
};

const panelAnchor = "--panel-anchor";

const thumbSize = 18;

const transparentBgAnchor = "--transparent-bg-anchor";

export const SpectrumColor = (props: SpectrumColorProps) => {
	const [scopedHsl, setScopedHsl] = createSignal(props.hsl);

	const initialSpectrumThumbPosition = getPositionFromSaturationLightness({
		saturation: props.hsl.s,
		lightness: props.hsl.l,
	});

	const [spectrumThumbPosition, setSpectrumThumbPosition] =
		createSignal<ThumbPosition>({
			xPosition: initialSpectrumThumbPosition.xPosition,
			yPosition: initialSpectrumThumbPosition.yPosition,
		});

	const initialHueThumbPosition = getHueThumbPosition({ hue: props.hsl.h });

	const [hueThumbPosition, setHueThumbPosition] = createSignal(
		initialHueThumbPosition,
	);

	const initialAlphaThumbPosition = getAlphaThumbPosition({
		alpha: props.hsl.a,
	});

	const [alphaThumbPosition, setAlphaThumbPosition] = createSignal(
		initialAlphaThumbPosition,
	);

	let panel: HTMLDivElement | undefined;

	const hslColor = createMemo(() => ColorFormat.hsl(props.hsl).color());

	const filledHslColor = createMemo(() =>
		ColorFormat.hsl({ ...props.hsl, a: 1 }).color(),
	);

	const hueColor = createMemo(() =>
		ColorFormat.hsl({ h: props.hsl.h, s: 100, l: 50, a: 1 }).color(),
	);

	const hueSliderTrackColor = createMemo(() =>
		Array.from({ length: 12 }, (_, i) =>
			ColorFormat.hsl({ h: i * 30, s: 100, l: 50, a: 1 }).color(),
		).join(", "),
	);

	const alphaSliderTrackColor = createMemo(() =>
		ColorFormat.hsl({ ...props.hsl, a: 0.7 }).color(),
	);

	createEffect(
		() => [props.hsl, scopedHsl()],
		([hsl, scopedHsl]) => {
			/**
			 * Calculating the spectrumThumbPosition from HSL gets slightly
			 * different result therefore we only update the thumbs by hsl
			 * if it is updated from outside of the component.
			 */
			if (
				hsl.h === scopedHsl.h &&
				hsl.s === scopedHsl.s &&
				hsl.l === scopedHsl.l &&
				hsl.a === scopedHsl.a
			) {
				return;
			}

			setScopedHsl(props.hsl);

			const spectrumThumbPosition = getPositionFromSaturationLightness({
				saturation: props.hsl.s,
				lightness: props.hsl.l,
			});
			const hueThumbPosition = getHueThumbPosition({ hue: props.hsl.h });
			const alphaThumbPosition = getAlphaThumbPosition({
				alpha: props.hsl.a,
			});

			setSpectrumThumbPosition(spectrumThumbPosition);
			setHueThumbPosition(hueThumbPosition);
			setAlphaThumbPosition(alphaThumbPosition);
		},
	);

	const manageColorUpdate = ({ hsl }: ManageColorUpdateProps) => {
		setScopedHsl(hsl);
		props.onColorChange({ hsl });
	};

	const manageThumbUpdate = ({
		clientX,
		clientY,
		panel,
	}: ManageThumbUpdateProps) => {
		const { xPosition, yPosition } = getThumbPositionInPercentage({
			clientX,
			clientY,
			panel,
		});

		setSpectrumThumbPosition({ xPosition, yPosition });

		const { saturation, lightness } = getSaturationLightnessFromPosition({
			xPosition,
			yPosition,
		});

		const roundedS = Math.max(0, Math.min(100, saturation));
		const roundedL = Math.max(0, Math.min(100, lightness));

		manageColorUpdate({ hsl: { ...props.hsl, s: roundedS, l: roundedL } });
	};

	const onPointerDown = (pointerEvent: PointerEvent) => {
		pointerEvent.preventDefault();

		const { pointerId, clientX, clientY } = pointerEvent;

		if (!panel) {
			throw new Error("Panel can't be null.");
		}

		panel.setPointerCapture(pointerId);

		panel.style.cursor = "move";

		manageThumbUpdate({ clientX, clientY, panel });
	};

	const onPointerMove = (pointerEvent: PointerEvent) => {
		const { pointerId, clientX, clientY } = pointerEvent;

		if (!panel) {
			throw new Error("Panel can't be null.");
		}

		if (!panel.hasPointerCapture(pointerId)) {
			return;
		}

		manageThumbUpdate({ clientX, clientY, panel });
	};

	const onPointerUp = (pointerEvent: PointerEvent) => {
		const { pointerId } = pointerEvent;

		if (!panel) {
			throw new Error("Panel can't be null.");
		}

		panel.releasePointerCapture(pointerId);

		panel.style.removeProperty("cursor");
	};

	const onHueThumbChange: OnThumbChangeFn = ({ position: value }) => {
		const hue = Math.round(359 * (value / 100));

		manageColorUpdate({ hsl: { ...props.hsl, h: hue } });

		setHueThumbPosition(value);
	};

	const onAlphaThumbChange: OnThumbChangeFn = ({ position: value }) => {
		const alpha = +(value / 100).toFixed(2);

		manageColorUpdate({ hsl: { ...props.hsl, a: alpha } });

		setAlphaThumbPosition(value);
	};

	const renderAlphaSliderChildren: RenderChildrenFn = ({ sliderAnchor }) => (
		<div>
			<TransparentBackground
				class="absolute rounded-full"
				squareSize={6}
				style={{
					"position-anchor": sliderAnchor,
					inset: "anchor(top) anchor(right) anchor(bottom) anchor(left)",
					width: "anchor-size(width)",
					height: "anchor-size(height)",
				}}
			/>
			<div
				class="absolute rounded-full"
				style={{
					"position-anchor": sliderAnchor,
					inset: "anchor(top) anchor(right) anchor(bottom) anchor(left)",
					background: `linear-gradient(to left, ${alphaSliderTrackColor()}, #fff0)`,
				}}
			/>
		</div>
	);

	return (
		<div class={["inline-block", props.class]} style={props.style}>
			<div
				ref={panel}
				class="cursor-crosshair"
				style={{
					"anchor-scope": panelAnchor,
					"anchor-name": panelAnchor,
					width: `${props.spectrumWidth}px`,
					height: `${props.spectrumHeight}px`,
					"background-color": hueColor(),
				}}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
			>
				<div
					class="absolute"
					style={{
						"position-anchor": panelAnchor,
						top: "anchor(top)",
						left: "anchor(left)",
						right: "anchor(right)",
						bottom: "anchor(bottom)",
						"background-image": `linear-gradient(to top, black, #fff0),
							linear-gradient(to right, white, #0000)`,
					}}
				/>
				<span
					class="absolute rounded-full border-2 border-white shadow-[0px_0px_4px_1px_#888]"
					style={{
						"position-anchor": panelAnchor,
						top: `calc(anchor(${100 - spectrumThumbPosition().yPosition}%) - ${thumbSize / 2}px)`,
						left: `calc(anchor(${spectrumThumbPosition().xPosition}%) - ${thumbSize / 2}px)`,
						width: `${thumbSize}px`,
						height: `${thumbSize}px`,
						"background-color": filledHslColor(),
					}}
					onPointerDown={onPointerDown}
					onPointerUp={onPointerUp}
				/>
			</div>
			<div class="px-2 py-4">
				<div class="flex gap-6">
					<span style={{ "anchor-scope": transparentBgAnchor }}>
						<TransparentBackground
							width="100%"
							height="100%"
							squareSize={10}
							class="size-12 rounded-full"
							style={{ "anchor-name": transparentBgAnchor }}
						/>
						<span
							// Setting it size-12 causes "px bug" due to rounded-full (visible in dark-mode)
							class="absolute size-12.5 rounded-full"
							style={{
								"position-anchor": transparentBgAnchor,
								"position-area": "center",
								"background-color": hslColor(),
							}}
						/>
					</span>
					<div class="flex grow flex-col justify-between">
						<Slider
							thumbColor={hueColor()}
							thumbSize={22}
							trackHeight={18}
							sliderTrackColor={`linear-gradient(to right, ${hueSliderTrackColor()})`}
							position={hueThumbPosition()}
							onThumbChange={onHueThumbChange}
							class="cursor-crosshair"
						/>
						<Slider
							thumbColor="#b3b3b3"
							thumbSize={22}
							trackHeight={18}
							position={alphaThumbPosition()}
							onThumbChange={onAlphaThumbChange}
							class="cursor-crosshair"
							renderChildren={renderAlphaSliderChildren}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
