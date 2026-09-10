import { createMemo } from "solid-js";
import { useReactiveEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const BlockQuoteToolbarButton = () => {
	const { blockQuote, readOnly } = useReactiveEditorContext();

	if (!blockQuote) {
		throw new Error("BlockQuote can't be undefined.");
	}

	const disabled = createMemo(
		() => !blockQuote.canWrap() || !!readOnly?.checked(),
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
