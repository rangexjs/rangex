import type {
	LinkApplyParams,
	LinkDisplayText,
	LinkMode,
	LinkToggleButtons,
	LinkURL,
	LinkView,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveLinkPort {
	readonly overlayEl: HTMLDivElement;

	canApply: Accessor<boolean>;
	view: Accessor<LinkView>;
	mode: Accessor<LinkMode>;
	displayText: Accessor<LinkDisplayText>;
	url: Accessor<LinkURL>;
	toggleButtons: Accessor<LinkToggleButtons>;

	toolbarClick(): void;
	viewChange(view: LinkView): void;
	cancel(): void;
	insert(params: LinkApplyParams): void;
	modify(params: LinkApplyParams): void;
	unwrap(): void;
}

export interface ReactiveLinkResult {
	port: ReactiveLinkPort;
	dispose: () => void;
}
