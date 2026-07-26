import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const HistoryBackToolbarButton = () => {
	const { undoRedoUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("UndoRedoUIPort can't be null.");
	}

	const [disabled, setDisabled] = createSignal(
		uiPort.historyBackToolbarButton.disabled,
	);

	onMount(() => {
		const unsubscribe = uiPort.onHistoryBackToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitNavigate({ type: "history-back" });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ArrowBendUpLeft" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
