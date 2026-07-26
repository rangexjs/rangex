import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const BlockQuoteToolbarButton = () => {
	const { blockQuoteUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("BlockQuoteUIPort can't be null.");
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
				<Icon name="BlockQuote" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
