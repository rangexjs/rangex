import type { HTMLLayout } from "rich-text-area";

export interface GetEmbedTitleParams {
	iframe: HTMLLayout;
}

export type GetEmbedTitleResult = string;

export interface SetEmbedTitleParams {
	iframe: HTMLLayout;
	title: string;
}
