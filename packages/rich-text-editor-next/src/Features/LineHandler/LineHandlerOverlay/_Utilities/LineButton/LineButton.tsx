import type { JSX } from "@solidjs/web/jsx-runtime";

interface LineButtonProps
	extends Omit<
		JSX.ButtonHTMLAttributes<HTMLButtonElement>,
		"type" | "classList"
	> {}

export const LineButton = (props: LineButtonProps) => {
	return (
		<button type="button" class="btn-menu-trigger rounded-sm p-1" {...props}>
			{props.children}
		</button>
	);
};
