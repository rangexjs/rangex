import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const TextAreaReadabilityToolbarButton = () => {
	const {
		nonCategorizedOperationButtonsStateManager,
		toolbarButtonsActionManager,
	} = useToolbarButtonManagersContext();

	const { textAreaReadability } = nonCategorizedOperationButtonsStateManager;

	const [checked, setChecked] = createSignal(textAreaReadability.checked);

	nonCategorizedOperationButtonsStateManager.subscribe({
		type: toolbarButtonsName.textAreaReadability,
		callback: (state) => setChecked(state.checked),
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitNonCategorizedOperationChange({
			type: toolbarButtonsName.textAreaReadability,
			newState: !checked(),
		});
	};

	return (
		<span>
			<ToolbarButton checked={checked()} onClick={onClick}>
				<Icon name="LockSimple" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
