import { BlockQuote, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BlockQuoteToolbarButton = () => {
	const { blockQuote, readOnly } = useEditorContext();

	if (!blockQuote) {
		throw new Error("BlockQuote can't be undefined.");
	}

	const $blockQuote = BlockQuote(blockQuote);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() => !$blockQuote.canWrap() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		blockQuote.wrap();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="BlockQuote" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
