import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface UnderlineToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const UnderlineToolbarButton = (props: UnderlineToolbarButtonProps) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.underline.disabled);
	const [pressed, setPressed] = createSignal(uiPort.underline.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribe = uiPort.onUnderlineUpdate((state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitFormattingChange({ underline: pressed() });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Underline" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
