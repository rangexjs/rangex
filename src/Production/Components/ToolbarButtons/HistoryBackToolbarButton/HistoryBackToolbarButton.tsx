import { createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const HistoryBackToolbarButton = () => {
	const { toolbarButtonsActionManager, historyNavigationButtonsStateManager } =
		useToolbarButtonManagersContext();
	const { historyBack } = historyNavigationButtonsStateManager;

	const [disabled, setDisabled] = createSignal(historyBack.disabled);

	historyNavigationButtonsStateManager.subscribe({
		type: toolbarButtonsName.historyBack,
		callback: (state) => {
			setDisabled(state.disabled);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitHistoryNavigationChange({
			type: "history-back",
		});
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ArrowBendUpLeft" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
