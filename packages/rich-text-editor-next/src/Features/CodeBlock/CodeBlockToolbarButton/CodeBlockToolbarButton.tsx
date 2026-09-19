import { CodeBlock, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext, useUIOptionsContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const CodeBlockToolbarButton = () => {
	const editor = useEditorContext();
	const uiOptions = useUIOptionsContext();

	const { codeBlock, readOnly } = editor;
	const { defaultLanguage, defaultTheme } = uiOptions.codeBlock;

	if (!codeBlock) {
		throw new Error("CodeBlock can't be undefined.");
	}

	const $codeBlock = CodeBlock(codeBlock);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() =>
			!($codeBlock.isActive() || $codeBlock.canWrap()) ||
			!!$readOnly?.checked(),
	);

	const onClick = () => {
		if ($codeBlock.isActive()) {
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
				checked={$codeBlock.isActive()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="CodeBlock" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
