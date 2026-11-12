import { className, Portal } from "@solidjs/web";
import { createRenderEffect } from "solid-js";

import type { FloatingPortalProps } from "./FloatingPortal-types";

export const FloatingPortal = (props: FloatingPortalProps) => {
	createRenderEffect(
		() => props.class,
		(value, prevValue) => {
			className(props.mount, value, prevValue);
		},
	);

	return <Portal mount={props.mount}>{props.children}</Portal>;
};
