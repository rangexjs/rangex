import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../_Utilities";

export const BoldToolbarButton = () => {
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.bold.disabled,
	);
	const [pressed, setPressed] = createSignal(formattingUIPort.bold.pressed);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribeBold = formattingUIPort.onBoldUpdate((state) => {
			setButtonDisabled(state.disabled);
			setPressed(state.pressed);
		});
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeBold();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		formattingUIPort.emitFormattingChange({ bold: pressed() });
	};

	const disabled = createMemo(() => buttonDisabled() || readOnly());

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Bold" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
