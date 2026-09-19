import { CodeBlock, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useCodeBlockContext, useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CodeBlockToolbarButton = () => {
	const { codeBlock, readOnly } = useEditorContext();
	const { defaultLanguage, defaultTheme } = useCodeBlockContext();

	if (!codeBlock) {
		throw new Error("CodeBlock can't be undefined.");
	}

	const $codeBlock = CodeBlock(codeBlock);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => !$codeBlock.canWrap() || !!$readOnly?.checked(),
	);

	const wrap = () => {
		const language = defaultLanguage ?? null;
		const theme = defaultTheme ?? null;
		codeBlock.wrap({ language, theme });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={wrap}>
				<Icon name="CodeBlock" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
