import type { JSX } from "@solidjs/web";

export interface FloatingPortalProps {
	mount: HTMLElement;
	class?: JSX.ClassValue;
	children: JSX.Element;
}
