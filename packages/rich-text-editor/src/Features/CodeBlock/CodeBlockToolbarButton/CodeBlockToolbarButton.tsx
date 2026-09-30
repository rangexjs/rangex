import { CodeBlock, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext, useUIOptionsContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CodeBlockToolbarButton = () => {
	const editor = useEditorContext();
	const uiOptions = useUIOptionsContext();

	const { codeBlock, readOnly } = editor;
	const codeBlockOptions = uiOptions.codeBlock;

	if (!codeBlock) {
		throw new Error("CodeBlock can't be undefined.");
	}

	if (!codeBlockOptions) {
		throw new Error("CodeBlockOptions can't be undefined.");
	}

	const { defaultLanguage, defaultTheme } = codeBlockOptions;

	const $codeBlock = CodeBlock(codeBlock);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() =>
			!($codeBlock.isSelectionActive() || $codeBlock.canWrap()) ||
			!!$readOnly?.checked(),
	);

	const onClick = () => {
		if ($codeBlock.isSelectionActive()) {
			codeBlock.unwrap();
			return;
		}

		const language = defaultLanguage ?? null;
		const theme = defaultTheme ?? null;
		codeBlock.wrap({ language, theme });
	};

	return (
		<span>
			<ToolbarButton
				checked={$codeBlock.isSelectionActive()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={`${$codeBlock.isSelectionActive()}`}
			>
				<Icon name="CodeBlock" title="Code block" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
