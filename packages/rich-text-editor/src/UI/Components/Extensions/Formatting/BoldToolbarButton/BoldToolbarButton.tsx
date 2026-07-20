import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface BoldToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const BoldToolbarButton = (props: BoldToolbarButtonProps) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.bold.disabled);
	const [pressed, setPressed] = createSignal(uiPort.bold.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribe = uiPort.onBoldUpdate((state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitFormattingChange({ bold: pressed() });
	};

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
