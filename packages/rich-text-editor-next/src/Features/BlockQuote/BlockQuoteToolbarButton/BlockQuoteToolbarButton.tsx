import { BlockQuote, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BlockQuoteToolbarButton = () => {
	const editor = useEditorContext();
	const { blockQuote, readOnly } = editor;

	if (!blockQuote) {
		throw new Error("BlockQuote can't be undefined.");
	}

	const $blockQuote = BlockQuote(blockQuote);
	const $readOnly = ReadOnly(readOnly);

	const disabled = createMemo(
		() =>
			!($blockQuote.isActive() || $blockQuote.canWrap()) ||
			!!$readOnly?.checked(),
	);

	const onClick = () => {
		if ($blockQuote.isActive()) {
			blockQuote.unwrap();
			return;
		}

		blockQuote.wrap();
	};

	return (
		<span>
			<ToolbarButton
				checked={$blockQuote.isActive()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="BlockQuote" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
