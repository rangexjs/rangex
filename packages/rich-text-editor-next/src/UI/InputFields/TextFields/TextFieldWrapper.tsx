import type { JSX } from "@solidjs/web/jsx-runtime";
import { Show } from "solid-js";

interface TextFieldWrapperProps {
	appearance: "primary-outline" | "neutral-filled-underline";
	size: "small" | "medium";
	class?: string;
	style?: JSX.CSSProperties;
	prefixClass?: string;
	prefix?: JSX.Element;
	postfixClass?: string;
	postfix?: JSX.Element;
	children: JSX.Element;
}

/**
 * Designed to provide appearance options for TextFields.
 */
export const TextFieldWrapper = (props: TextFieldWrapperProps) => {
	return (
		<label
			class={[
				"inline-flex items-center gap-1",
				{
					"text-field-primary-outline": props.appearance === "primary-outline",
					"text-field-neutral-filled-underline":
						props.appearance === "neutral-filled-underline",
					"p-1.5 text-xs": props.size === "small",
					"p-2 text-sm": props.size === "medium",
				},
				props.class,
			]}
			style={props.style}
		>
			<Show when={props.prefix}>
				<span
					class={[
						"text-neutral-600 text-xs dark:text-neutral-300",
						props.prefixClass,
					]}
				>
					{props.prefix}
				</span>
			</Show>
			{props.children}
			<Show when={props.postfix}>
				<span
					class={[
						"text-neutral-600 text-xs dark:text-neutral-300",
						props.postfixClass,
					]}
				>
					{props.postfix}
				</span>
			</Show>
		</label>
	);
};
