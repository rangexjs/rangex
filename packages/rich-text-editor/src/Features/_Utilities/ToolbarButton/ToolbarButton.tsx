import type { JSX } from "@solidjs/web";
import { Show } from "solid-js";
import { Icon } from "#ui";

export interface ToolbarButtonProps {
	checked?: boolean;
	disabled?: boolean;
	hasChevron?: boolean;
	class?: JSX.ClassValue;
	containerClass?: JSX.ClassValue;
	commandfor?: string;
	command?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["command"];
	style?: JSX.CSSProperties;
	onClick?: (event: MouseEvent) => void;
	"aria-pressed"?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["aria-pressed"];
	"aria-expanded"?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["aria-expanded"];
	children: JSX.Element;
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
	return (
		<button
			type="button"
			onClick={props.onClick}
			disabled={props.disabled}
			class={["toolbar-button", props.class]}
			commandfor={props.commandfor}
			command={props.command}
			style={props.style}
			aria-pressed={props["aria-pressed"]}
			aria-expanded={props["aria-expanded"]}
			data-checked={`${!!props.checked}`}
		>
			<span class={["inline-flex items-center", props.containerClass]}>
				{props.children}
			</span>
			<Show when={props.hasChevron}>
				<Icon name="CaretDown" class="size-2" />
			</Show>
		</button>
	);
};
