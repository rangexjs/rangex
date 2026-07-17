import type { JSX } from "solid-js";

type Command =
	| "toggle-popover"
	| "show-popover"
	| "hide-popover"
	| "show-modal"
	| "close";

interface MenuBarButtonProps {
	children: JSX.Element;
	commandfor?: string;
	command?: Command;
	onClick?: () => void;
}

export const MenuBarButton = (props: MenuBarButtonProps) => (
	<button
		type="button"
		class="btn-menu-trigger rounded-sm px-2 py-0.5 font-medium text-xs"
		commandfor={props.commandfor}
		command={props.command}
		on:click={props.onClick}
	>
		{props.children}
	</button>
);
