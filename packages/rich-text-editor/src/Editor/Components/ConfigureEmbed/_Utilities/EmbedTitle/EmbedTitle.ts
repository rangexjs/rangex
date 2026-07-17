import type {
	GetEmbedTitleParams,
	GetEmbedTitleResult,
	SetEmbedTitleParams,
} from "./EmbedTitle-types";

export const getEmbedTitle = ({
	iframe,
}: GetEmbedTitleParams): GetEmbedTitleResult =>
	iframe.getAttribute("title") ?? "";

export const setEmbedTitle = ({ iframe, title }: SetEmbedTitleParams) => {
	iframe.setAttribute("title", title);
};
