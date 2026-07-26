import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const HistoryForwardToolbarButton = () => {
	const { undoRedoUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("UndoRedoUIPort can't be null.");
	}

	const [disabled, setDisabled] = createSignal(
		uiPort.historyForwardToolbarButton.disabled,
	);

	onMount(() => {
		const unsubscribe = uiPort.onHistoryForwardToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitNavigate({ type: "history-forward" });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ArrowBendUpRight" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
