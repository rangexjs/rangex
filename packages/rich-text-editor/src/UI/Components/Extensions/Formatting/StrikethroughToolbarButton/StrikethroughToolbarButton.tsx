import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const StrikethroughToolbarButton = () => {
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.strikethrough.disabled,
	);
	const [pressed, setPressed] = createSignal(
		formattingUIPort.strikethrough.pressed,
	);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribeStrikethrough = formattingUIPort.onStrikethroughUpdate(
			(state) => {
				setButtonDisabled(state.disabled);
				setPressed(state.pressed);
			},
		);
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeStrikethrough();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		formattingUIPort.emitFormattingChange({ strikethrough: pressed() });
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
				<Icon name="Strikethrough" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
