import { extendObjectProperties } from "#utilities";

import type {
	CreateMarkdownAdapterParams,
	CreateMarkdownAdapterResult,
	MarkdownConfigPort,
	MarkdownConfigPortProps,
	MarkdownInternals,
	MarkdownPublicPort,
	MarkdownPublicPortProps,
} from "./MarkdownAdapter-types";

export const createMarkdownAdapter = (
	...params: CreateMarkdownAdapterParams
): CreateMarkdownAdapterResult => {
	const [settings, { adapterBus }] = params;

	adapterBus.registerAdapter("markdown");

	const internals: MarkdownInternals = {
		codeBlockTriggers: settings.codeBlockTriggers ?? [{ trigger: "", language: null, theme: null }],
	};

	const configPort: MarkdownConfigPort = extendObjectProperties({}, {
		get codeBlockTriggers() {
			return internals.codeBlockTriggers;
		},
	} satisfies MarkdownConfigPortProps);

	const publicPort: MarkdownPublicPort = extendObjectProperties(
		{},
		{} satisfies MarkdownPublicPortProps,
	);

	return { configPort, publicPort };
};
