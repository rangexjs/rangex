import type { JSX } from "@solidjs/web";
import { onSettled } from "solid-js";

export interface SpinningProps {
	class?: JSX.ClassValue;
	strokeWidth: number;
	blueprintColor: string;
	loadingColor: string;
}

export const Spinning = (props: SpinningProps) => {
	let blueprint: SVGPathElement | undefined;
	let spinning: SVGPathElement | undefined;

	const size = 24;
	const halfSize = size / 2;
	const halfStrokeWidth = props.strokeWidth / 2;
	const circlePath = `
	M ${halfSize} ${halfStrokeWidth} 
	A 1 1, 0, 0 1, ${halfSize} ${size - halfStrokeWidth} 
	A 1 1, 0, 0 1, ${halfSize} ${halfStrokeWidth}`;

	onSettled(() => {
		if (!(blueprint && spinning)) {
			throw new Error("Elements can't be undefined.");
		}

		const blueprintLength = blueprint.getTotalLength();

		spinning.setAttribute("stroke-dasharray", `${blueprintLength}`);

		spinning.animate(
			[
				{ strokeDashoffset: -blueprintLength - 10 },
				{ strokeDashoffset: -blueprintLength * 3 - 10 },
			],
			{ duration: 4000, easing: "ease-in-out", iterations: Infinity },
		);

		spinning.animate(
			[{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
			{ duration: 2000, easing: "linear", iterations: Infinity },
		);
	});

	const pathProps = {
		fill: "none",
		d: circlePath,
		"stroke-width": props.strokeWidth,
	};

	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			xmlns="http://www.w3.org/2000/svg"
			class={props.class}
		>
			<title>Loading</title>
			<path ref={blueprint} stroke={props.blueprintColor} {...pathProps} />
			<path
				ref={spinning}
				stroke-linecap="round"
				class="origin-center"
				stroke={props.loadingColor}
				{...pathProps}
			/>
		</svg>
	);
};
