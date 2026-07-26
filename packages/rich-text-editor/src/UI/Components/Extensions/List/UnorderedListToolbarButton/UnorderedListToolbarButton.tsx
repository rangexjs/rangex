import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const UnorderedListToolbarButton = () => {
	const { listUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!listUIPort) {
		throw new Error("ListUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		listUIPort.unorderedListToolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeUnorderedList =
			listUIPort.onUnorderedListToolbarButtonUpdate((state) => {
				setButtonDisabled(state.disabled);
			});
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeUnorderedList();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		listUIPort.emitInsertRequest({ type: "unordered-list" });
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListBullets" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
