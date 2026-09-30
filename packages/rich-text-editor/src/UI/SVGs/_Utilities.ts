import type { JSX } from "@solidjs/web";

export interface SVGProps
	extends Omit<
		JSX.SvgSVGAttributes<SVGSVGElement>,
		"viewBox" | "fill" | "xmlns"
	> {
	title?: string;
}
