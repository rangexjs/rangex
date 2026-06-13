import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const AnchorToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { anchor } = nodeInsertionButtonsStateManager;
	const [checked, setChecked] = createSignal(anchor.checked);
	const [disabled, setDisabled] = createSignal(anchor.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.anchor,
		callback: (state) => {
			setChecked(state.checked);
			setDisabled(state.disabled);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({ type: "anchor" });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="SimpleLink" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
