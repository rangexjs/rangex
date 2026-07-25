import { createSignal, onCleanup, onMount } from "solid-js";
import type { EmptyMediaUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface EmptyMediaToolbarButtonProps {
	uiPort: EmptyMediaUIPort;
}

export const EmptyMediaToolbarButton = (
	props: EmptyMediaToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

	const [disabled, setDisabled] = createSignal(uiPort.toolbarButton.disabled);

	onMount(() => {
		const unsubscribe = uiPort.onToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitInsertRequest();
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="FileArrowUp" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
