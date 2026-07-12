import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const ImageToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { image } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(image.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.image,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.image,
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="Image" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
