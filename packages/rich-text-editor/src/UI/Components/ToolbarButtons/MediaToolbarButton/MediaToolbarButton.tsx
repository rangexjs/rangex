import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const MediaToolbarButton = () => {
	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { media } = nodeInsertionButtonsStateManager;

	const [disabled, setDisabled] = createSignal(media.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.media,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitNodeInsertionChange({
			type: toolbarButtonsName.media,
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="FileArrowUp" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
