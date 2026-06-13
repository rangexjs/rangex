import type { JSX } from "solid-js";

interface MenuBarButtonProps {
	children: JSX.Element;
	commandfor?: string;
	command?: "toggle-popover" | "show-popover" | "hide-popover";
	onClick?: () => void;
}

export const MenuBarButton = (props: MenuBarButtonProps) => (
	<button
		type="button"
		class="rounded-sm border border-transparent px-2 py-0.5 font-medium text-neutral-600 text-xs transition-colors hover:bg-neutral-100 hover:text-neutral-800 active:border-neutral-200 active:text-neutral-900"
		commandfor={props.commandfor}
		command={props.command}
		on:click={props.onClick}
	>
		{props.children}
	</button>
);
