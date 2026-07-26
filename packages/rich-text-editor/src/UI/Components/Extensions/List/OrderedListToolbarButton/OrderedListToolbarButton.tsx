import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const OrderedListToolbarButton = () => {
	const { listUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("ListUIPort can't be null.");
	}

	const [disabled, setDisabled] = createSignal(
		uiPort.orderedListToolbarButton.disabled,
	);

	onMount(() => {
		const unsubscribe = uiPort.onOrderedListToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitInsertRequest({ type: "ordered-list" });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListNumbers" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
