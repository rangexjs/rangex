import { createBlockComponentPlacement } from "#engine-links";
import type { ConfigureMarkdownParams } from "./ConfigureMarkdown-types";
import { handleBlockMarkdown } from "./HandleBlockMarkdown";
import { handleInlineMarkdown } from "./HandleInlineMarkdown";
import { handleLinkMarkdown } from "./HandleLinkMarkdown";
import { handleSeparatorMarkdown } from "./HandleSeparatorMarkdown";

export const configureMarkdown = ({ editorAPI }: ConfigureMarkdownParams) => {
	const blockComponentPlacement = createBlockComponentPlacement({ editorAPI });

	const blockMarkdownCleanup = handleBlockMarkdown({
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
