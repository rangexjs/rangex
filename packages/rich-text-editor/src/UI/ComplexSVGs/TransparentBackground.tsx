import type { JSX } from "@solidjs/web";
import { createUniqueId } from "solid-js";

export interface SVGProps
	extends Omit<
		JSX.SvgSVGAttributes<SVGSVGElement>,
		"viewBox" | "fill" | "xmlns"
	> {}

interface TransparentBackgroundProps
	extends Omit<
		JSX.SvgSVGAttributes<SVGSVGElement>,
		"viewBox" | "fill" | "xmlns"
	> {
	squareSize: number;
}

export const TransparentBackground = (props: TransparentBackgroundProps) => {
	const id = createUniqueId();

	return (
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
			<title>Transparent Background</title>
			<defs>
				<pattern
					id={id}
					patternUnits="userSpaceOnUse"
					width={props.squareSize * 2}
					height={props.squareSize * 2}
				>
					<rect
						width={props.squareSize * 2}
						height={props.squareSize * 2}
						fill="#ffffff"
					/>
					<rect
						width={props.squareSize}
						height={props.squareSize}
						fill="#dcdcdc"
					/>
					<rect
						x={props.squareSize}
						y={props.squareSize}
						width={props.squareSize}
						height={props.squareSize}
						fill="#dcdcdc"
					/>
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${id})`} />
		</svg>
	);
};
