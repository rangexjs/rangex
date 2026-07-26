import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const UnorderedListToolbarButton = () => {
	const { listUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("ListUIPort can't be null.");
	}

	const [disabled, setDisabled] = createSignal(
		uiPort.unorderedListToolbarButton.disabled,
	);

	onMount(() => {
		const unsubscribe = uiPort.onUnorderedListToolbarButtonUpdate((state) => {
			setDisabled(state.disabled);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitInsertRequest({ type: "unordered-list" });
	};

	return (
		<span>
			<ToolbarButton disabled={disabled()} onClick={onClick}>
				<Icon name="ListBullets" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
