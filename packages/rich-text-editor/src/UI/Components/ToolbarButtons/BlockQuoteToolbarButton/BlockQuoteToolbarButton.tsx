import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const BlockQuoteToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { codeBlock } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(codeBlock.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.codeBlock,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.blockQuote,
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="BlockQuote" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
