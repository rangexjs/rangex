import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const OrderedListToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { orderedList } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(orderedList.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.orderedList,
		callback: (state) => setDisabled(state.disabled),
	});

	const emitListInsertionInfo = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.orderedList,
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={emitListInsertionInfo}>
				<Icon name="ListNumbers" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
