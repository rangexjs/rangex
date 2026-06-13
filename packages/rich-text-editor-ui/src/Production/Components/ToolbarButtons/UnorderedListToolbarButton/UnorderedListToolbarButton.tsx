import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const UnorderedListToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { unorderedList } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(unorderedList.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.unorderedList,
		callback: (state) => setDisabled(state.disabled),
	});

	const emitListInsertionInfo = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.unorderedList,
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={emitListInsertionInfo}>
				<Icon name="ListBullets" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
