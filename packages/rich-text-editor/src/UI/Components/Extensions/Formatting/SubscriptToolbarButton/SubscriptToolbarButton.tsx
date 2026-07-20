import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface SubscriptToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const SubscriptToolbarButton = (props: SubscriptToolbarButtonProps) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.subscript.disabled);
	const [pressed, setPressed] = createSignal(uiPort.subscript.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribe = uiPort.onSubscriptUpdate((state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitFormattingChange({ subscript: pressed() });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Subscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
