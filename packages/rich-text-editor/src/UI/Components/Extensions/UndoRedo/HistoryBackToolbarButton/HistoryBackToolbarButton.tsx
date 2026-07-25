import { createSignal, onCleanup, onMount } from "solid-js";
import type { UndoRedoUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface HistoryBackToolbarButtonProps {
	uiPort: UndoRedoUIPort;
}

export const HistoryBackToolbarButton = (
	props: HistoryBackToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

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
