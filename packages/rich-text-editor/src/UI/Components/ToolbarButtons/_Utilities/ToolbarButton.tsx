import { type JSX, Show } from "solid-js";
import { Icon } from "../../Icon";

export interface ToolbarButtonProps {
	checked?: boolean;
	disabled?: boolean;
	hasChevron?: boolean;
	class?: string;
	containerClass?: string;
	commandfor?: string;
	command?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["command"];
	style?: JSX.CSSProperties;
	onClick?: (event: MouseEvent) => void;
	"aria-pressed"?: JSX.ButtonHTMLAttributes<HTMLButtonElement>["aria-pressed"];
	children: JSX.Element;
}

export const ToolbarButton = (props: ToolbarButtonProps) => {
	return (
		<button
			type="button"
			on:click={props.onClick}
			disabled={props.disabled}
			class="toolbar-button"
			classList={{ [props.class ?? ""]: true }}
			data-is-checked={props.checked}
			commandfor={props.commandfor}
			command={props.command}
			style={props.style}
			aria-pressed={props["aria-pressed"]}
		>
			<span
				class="inline-flex items-center"
				classList={{ [props.containerClass ?? ""]: true }}
			>
				{props.children}
			</span>
			<Show when={props.hasChevron}>
				<Icon name="CaretDown" class="size-2" />
			</Show>
		</button>
	);
};
