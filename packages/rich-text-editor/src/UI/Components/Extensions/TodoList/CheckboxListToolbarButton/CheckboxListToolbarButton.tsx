import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const CheckboxListToolbarButton = () => {
	const { todoListUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!todoListUIPort) {
		throw new Error("TodoListUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		todoListUIPort.toolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeToolbarButton = todoListUIPort.onToolbarButtonUpdate(
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
		todoListUIPort.emitInsertRequest();
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListChecks" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
