import type {
	LinkDisplayText,
	LinkInsertParams,
	LinkModifyParams,
} from "@rangex/editor";
import type { Accessor } from "solid-js";

export interface ReactiveLinkPort {
	readonly linkMenuEl: HTMLDivElement;
	readonly selectionMenu: HTMLDivElement;

	canInsert: Accessor<boolean>;
	linkMenuOpen: Accessor<boolean>;
	selectionMenuOpen: Accessor<boolean>;
	currentLink: Accessor<HTMLElement | null>;

	onLinkClickEvent(callback: () => void): () => void;
	onLinkSelectionInEvent(callback: () => void): () => void;

	insert(params: LinkInsertParams): void;
	modify(params: LinkModifyParams): void;
	unwrap(): void;
	openSelectionMenu(): void;
	closeSelectionMenu(): void;
	addExemptNode(node: HTMLElement): void;
	removeExemptNode(node: HTMLElement): void;
	getDisplayText(): LinkDisplayText;
}
