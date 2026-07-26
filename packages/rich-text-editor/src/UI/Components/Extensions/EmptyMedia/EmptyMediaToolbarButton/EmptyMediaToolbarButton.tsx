import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const EmptyMediaToolbarButton = () => {
	const { emptyMediaUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("EmptyMediaUIPort can't be null.");
	}

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
