import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const EmptyMediaToolbarButton = () => {
	const { emptyMediaUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!emptyMediaUIPort) {
		throw new Error("EmptyMediaUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		emptyMediaUIPort.toolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeToolbarButton = emptyMediaUIPort.onToolbarButtonUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeToolbarButton();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		emptyMediaUIPort.emitInsertRequest();
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="FileArrowUp" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
