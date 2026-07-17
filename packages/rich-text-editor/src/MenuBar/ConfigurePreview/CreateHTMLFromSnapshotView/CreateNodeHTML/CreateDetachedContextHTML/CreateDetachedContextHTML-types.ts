import type { DetachedContextView } from "rich-text-area";

export interface CreateDetachedContextHTMLParams {
	detachedContextView: DetachedContextView;
}

export type CreateDetachedContextHTMLResult = HTMLElement | null;
