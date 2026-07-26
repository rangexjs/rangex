import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const CodeToolbarButton = () => {
	const { formattingUIPort, readOnlyUIPort } = useUIPortsContext();

	if (!formattingUIPort) {
		throw new Error("FormattingUIPort can't be null.");
	}

	const [buttonDisabled, setButtonDisabled] = createSignal(
		formattingUIPort.code.disabled,
	);
	const [pressed, setPressed] = createSignal(formattingUIPort.code.pressed);
	const [readOnly, setReadOnly] = createSignal(
		!!readOnlyUIPort?.toolbarButton.checked,
	);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribeCode = formattingUIPort.onCodeUpdate((state) => {
			setButtonDisabled(state.disabled);
			setPressed(state.pressed);
		});
		const unsubscribeReadOnly = readOnlyUIPort?.onToolbarButtonUpdate((state) =>
			setReadOnly(state.checked),
		);

		onCleanup(() => {
			unsubscribeCode();
			unsubscribeReadOnly?.();
		});
	});

	const onClick = () => {
		formattingUIPort.emitFormattingChange({ code: pressed() });
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
				<Icon name="Code" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
