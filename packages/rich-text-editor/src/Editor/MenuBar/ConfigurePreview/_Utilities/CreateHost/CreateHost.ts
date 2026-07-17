import type { CreateHostParams } from "./CreateHost-types";

/**
 * Wrap `children` in a `<div>` with an open shadow root. Every preview tab's
 * content is one of these — a fully-built host the UI just mounts.
 */
export const createHost = ({ children }: CreateHostParams): HTMLElement => {
	const host = document.createElement("div");
	const shadowRoot = host.attachShadow({ mode: "open" });
	shadowRoot.append(...children);

	return host;
};
