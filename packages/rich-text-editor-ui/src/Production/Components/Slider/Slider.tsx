import type {
	GetThumbPositionInPercentageProps,
	ManageThumbUpdateProps,
	SliderProps,
} from "./Slider-types";

/**
 * Gets the position in percentage for the css anchor() function.
 *
 * It calculates the position based on the {@link sliderTrack}'s bounds and the clientX.
 */
const getThumbPositionInPercentage = ({
	sliderTrack,
	clientX,
}: GetThumbPositionInPercentageProps) => {
	const { left, right, width } = sliderTrack.getBoundingClientRect();

	if (clientX <= left) {
		return 0;
	}

	if (clientX >= right) {
		return 100;
	}

	const thumbPosition = clientX - left;

	const positionInPercentage = (thumbPosition / width) * 100;

	return positionInPercentage;
};

const sliderAnchor = "--slider-anchor";

export const Slider = (props: SliderProps) => {
	let sliderTrack: HTMLDivElement | undefined;

	const manageThumbUpdate = ({
		clientX,
		sliderTrack,
	}: ManageThumbUpdateProps) => {
		const position = getThumbPositionInPercentage({ clientX, sliderTrack });

		props.onThumbChange({ position });
	};

	const onPointerDown = (pointerEvent: PointerEvent) => {
		pointerEvent.preventDefault();

		const { pointerId, clientX } = pointerEvent;

		if (!sliderTrack) {
			throw new Error("SliderTrack can't be null.");
		}

		sliderTrack.setPointerCapture(pointerId);

		sliderTrack.style.cursor = "ew-resize";

		manageThumbUpdate({ clientX, sliderTrack });
	};

	const onPointerMove = (pointerEvent: PointerEvent) => {
		const { pointerId, clientX } = pointerEvent;

		if (!sliderTrack) {
			throw new Error("SliderTrack can't be null.");
		}

		if (!sliderTrack.hasPointerCapture(pointerId)) {
			return;
		}

		manageThumbUpdate({ clientX, sliderTrack });
	};

	const onPointerUp = (pointerEvent: PointerEvent) => {
		const { pointerId } = pointerEvent;

		if (!sliderTrack) {
			throw new Error("SliderTrack can't be null.");
		}

		sliderTrack.releasePointerCapture(pointerId);

		sliderTrack.style.removeProperty("cursor");
	};

	return (
		<div
			ref={sliderTrack}
			class="overflow-clip rounded-full"
			classList={{ [props.class ?? ""]: true }}
			style={{
				"anchor-scope": sliderAnchor,
				"anchor-name": sliderAnchor,
				height: `${props.trackHeight}px`,
				background: props.sliderTrackColor,
			}}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
		>
			<span
				class="absolute z-50 rounded-full border-2 border-white shadow-[0px_0px_4px_1px_#888]"
				style={{
					"position-anchor": sliderAnchor,
					"align-self": "anchor-center",
					width: `${props.thumbSize}px`,
					height: `${props.thumbSize}px`,
					left: `calc(anchor(${props.position}%) - ${props.thumbSize / 2}px)`,
					background: props.thumbColor,
				}}
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
			/>
			{props.renderChildren?.({ sliderAnchor })}
		</div>
	);
};
