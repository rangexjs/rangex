import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const HistoryForwardToolbarButton = () => {
	const { toolbarButtonsActionManager, historyNavigationButtonsStateManager } =
		useToolbarButtonManagersContext();
	const { historyBack } = historyNavigationButtonsStateManager;

	const [disabled, setDisabled] = createSignal(historyBack.disabled);

	historyNavigationButtonsStateManager.subscribe({
		type: toolbarButtonsName.historyForward,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitHistoryNavigationChange({
			type: "history-forward",
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ArrowBendUpRight" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
