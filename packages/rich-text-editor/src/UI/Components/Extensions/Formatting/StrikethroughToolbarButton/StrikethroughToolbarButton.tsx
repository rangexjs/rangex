import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface StrikethroughToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const StrikethroughToolbarButton = (
	props: StrikethroughToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.strikethrough.disabled);
	const [pressed, setPressed] = createSignal(uiPort.strikethrough.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribe = uiPort.onStrikethroughUpdate((state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitFormattingChange({ strikethrough: pressed() });
	};

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
