import type { JSX } from "@solidjs/web";

export type MenuBarButtonCommand =
	| "toggle-popover"
	| "show-popover"
	| "hide-popover"
	| "show-modal"
	| "close";

export interface MenuBarButtonProps {
	children: JSX.Element;
	commandfor?: string;
	command?: MenuBarButtonCommand;
	onClick?: () => void;
}
