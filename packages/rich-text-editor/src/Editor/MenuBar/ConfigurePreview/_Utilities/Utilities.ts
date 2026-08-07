import type { CreateHostParams, CreateTemplateParams } from "./Utilities-types";

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

/**
 * Wrap `children` in a `<div>` with an open shadow root. Every preview tab's
 * content is one of these — a fully-built host the UI just mounts.
 */
export const createTemplate = ({
	children,
}: CreateTemplateParams): HTMLTemplateElement => {
	const template = document.createElement("template");
	template.setAttribute("shadowrootmode", "open");
	template.append(...children);

	return template;
};
