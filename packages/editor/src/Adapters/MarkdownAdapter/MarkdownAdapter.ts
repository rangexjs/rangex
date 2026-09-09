import { extendObjectProperties } from "#utilities";
import type {
	CreateMarkdownAdapterParams,
	CreateMarkdownAdapterResult,
	MarkdownConfigPort,
	MarkdownConfigPortProps,
	MarkdownPublicPort,
	MarkdownPublicPortProps,
} from "./MarkdownAdapter-types";

export const createMarkdownAdapter = (
	...params: CreateMarkdownAdapterParams
): CreateMarkdownAdapterResult => {
	const [_settings, _options] = params;

	const configPort: MarkdownConfigPort = extendObjectProperties(
		{},
		{} satisfies MarkdownConfigPortProps,
	);

	const publicPort: MarkdownPublicPort = extendObjectProperties(
		{},
		{} satisfies MarkdownPublicPortProps,
	);

	return { configPort, publicPort };
};
