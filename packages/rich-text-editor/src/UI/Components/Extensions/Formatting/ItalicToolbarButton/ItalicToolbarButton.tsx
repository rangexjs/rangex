import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface ItalicToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const ItalicToolbarButton = (props: ItalicToolbarButtonProps) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.italic.disabled);
	const [pressed, setPressed] = createSignal(uiPort.italic.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribe = uiPort.onItalicUpdate((state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitFormattingChange({ italic: pressed() });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Italic" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
