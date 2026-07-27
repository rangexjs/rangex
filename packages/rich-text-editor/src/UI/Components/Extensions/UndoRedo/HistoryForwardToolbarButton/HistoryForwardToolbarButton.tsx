import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../_Utilities";

export const HistoryForwardToolbarButton = () => {
	const { undoRedoUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!undoRedoUIPort) {
		throw new Error("UndoRedoUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		undoRedoUIPort.historyForwardToolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeToolbarButton =
			undoRedoUIPort.onHistoryForwardToolbarButtonUpdate((state) => {
				setButtonDisabled(state.disabled);
			});
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeToolbarButton();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		undoRedoUIPort.emitNavigate({ type: "history-forward" });
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ArrowBendUpRight" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
