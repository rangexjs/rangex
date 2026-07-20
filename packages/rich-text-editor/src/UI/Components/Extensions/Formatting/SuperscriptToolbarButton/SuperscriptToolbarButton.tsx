import { createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { FormattingUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface SuperscriptToolbarButtonProps {
	uiPort: FormattingUIPort;
}

export const SuperscriptToolbarButton = (
	props: SuperscriptToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.superscript.disabled);
	const [pressed, setPressed] = createSignal(uiPort.superscript.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	onMount(() => {
		const unsubscribe = uiPort.onSuperscriptUpdate((state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitFormattingChange({ superscript: pressed() });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Superscript" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
