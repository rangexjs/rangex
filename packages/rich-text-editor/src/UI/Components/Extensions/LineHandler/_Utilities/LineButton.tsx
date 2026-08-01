import type { JSX } from "solid-js";

interface LineButtonProps
	extends Omit<
		JSX.ButtonHTMLAttributes<HTMLButtonElement>,
		"type" | "classList"
	> {}

export const LineButton = (props: LineButtonProps) => {
	return (
		<button
			type="button"
			class="rounded-sm p-1 text-neutral-600 transition-colors hover:bg-neutral-100 active:bg-neutral-200 active:text-neutral-900 dark:text-neutral-200 active:dark:bg-neutral-700 active:dark:text-neutral-100 hover:dark:bg-neutral-800"
			{...props}
		>
			{props.children}
		</button>
	);
};
