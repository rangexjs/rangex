import type {
	LinkDisplayText,
	LinkInsertParams,
	LinkModifyParams,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveSelectionMenuPort {
	readonly element: HTMLDivElement;

	isOpen: Accessor<boolean>;

	onToggle(callback: () => void): () => void;

	open(): void;
	close(): void;
	addExemptNode(node: HTMLElement): void;
	removeExemptNode(node: HTMLElement): void;
}

export interface ReactiveLinkPort {
	readonly linkMenuEl: HTMLDivElement;
	readonly selectionMenu: ReactiveSelectionMenuPort;

	canInsert: Accessor<boolean>;
	linkMenuOpen: Accessor<boolean>;
	currentLink: Accessor<HTMLElement | null>;

	onLinkClick(callback: () => void): () => void;
	onLinkSelectionIn(callback: () => void): () => void;

	insert(params: LinkInsertParams): void;
	modify(params: LinkModifyParams): void;
	unwrap(): void;
	getDisplayText(): LinkDisplayText;
}
