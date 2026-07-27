import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../_Utilities";

export const OrderedListToolbarButton = () => {
	const { listUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!listUIPort) {
		throw new Error("ListUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		listUIPort.orderedListToolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeOrderedList = listUIPort.onOrderedListToolbarButtonUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeOrderedList();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		listUIPort.emitInsertRequest({ type: "ordered-list" });
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListNumbers" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
