import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const CheckboxListToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { checkboxList } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(checkboxList.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.checkboxList,
		callback: (state) => setDisabled(state.disabled),
	});

	const emitListInsertionInfo = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.checkboxList,
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={emitListInsertionInfo}>
				<Icon name="ListChecks" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
