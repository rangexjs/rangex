import { createSignal, onCleanup, onMount } from "solid-js";
import type { UndoRedoUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface HistoryForwardToolbarButtonProps {
	uiPort: UndoRedoUIPort;
}

export const HistoryForwardToolbarButton = (
	props: HistoryForwardToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

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
