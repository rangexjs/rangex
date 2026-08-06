import type { DualTheme, ThemeBackgrounds, ThemedCodeLines } from "#libs";
import type { StorageMap } from "../../../CreateHTMLFromSnapshotView-types";

export interface ApplyTokenSpansParams {
	codeBlockEl: HTMLElement;
	contentLineEls: Element[];
	backgrounds: ThemeBackgrounds;
	codeLines: ThemedCodeLines;
	theme: DualTheme;
}

export interface ResolveCodeBlockParams {
	codeBlockEl: HTMLElement;
	storageMap: StorageMap;
}

export type ResolveCodeBlockResult = Promise<void>;
