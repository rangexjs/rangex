import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureMarkdownParams } from "./ConfigureMarkdown-types";
import { handleBlockMarkdown } from "./HandleBlockMarkdown";
import { handleInlineMarkdown } from "./HandleInlineMarkdown";
import { handleLinkMarkdown } from "./HandleLinkMarkdown";
import { handleSeparatorMarkdown } from "./HandleSeparatorMarkdown";

/*
 * Wires up all markdown auto-formatting handlers (block, separator, inline, and link
 * markdown) and returns their combined cleanup.
 */
export const configureMarkdown = ({
	adapterBus,
	configPort,
	editorAPI,
}: ConfigureMarkdownParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({
		editorAPI,
		adapterBus,
	});

	const blockMarkdownCleanup = handleBlockMarkdown({
		configPort,
		editorAPI,
		blockComponentPlacement,
	});

	const separatorMarkdownCleanup = handleSeparatorMarkdown({
		editorAPI,
		blockComponentPlacement,
	});

	const inlineMarkdownCleanup = handleInlineMarkdown({ editorAPI });

	const linkMarkdownCleanup = handleLinkMarkdown({ editorAPI });

	return () => {
		blockMarkdownCleanup();
		separatorMarkdownCleanup();
		inlineMarkdownCleanup();
		linkMarkdownCleanup();
	};
};
