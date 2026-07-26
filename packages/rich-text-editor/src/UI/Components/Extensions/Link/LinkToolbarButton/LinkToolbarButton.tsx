import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const LinkToolbarButton = () => {
	const { linkUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!linkUIPort) {
		throw new Error("LinkUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(linkUIPort.toolbarButton.checked);
	const [buttonDisabled, setButtonDisabled] = createSignal(
		linkUIPort.toolbarButton.disabled,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	onMount(() => {
		const unsubscribeToolbarButton = linkUIPort.onToolbarButtonUpdate(
			(state) => {
				setChecked(state.checked);
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
		linkUIPort.emitToolbarClick();
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="SimpleLink" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
