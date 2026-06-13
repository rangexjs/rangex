import type { JSX } from "solid-js";

export interface SVGProps
	extends Omit<
		JSX.SvgSVGAttributes<SVGSVGElement>,
		"viewBox" | "fill" | "xmlns"
	> {}
