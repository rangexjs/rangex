import { createSignal, onCleanup, onMount } from "solid-js";
import { useUIPortsContext } from "../../../App";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

export const ReadOnlyToolbarButton = () => {
	const { readOnlyUIPort: uiPort } = useUIPortsContext();

	if (!uiPort) {
		throw new Error("ReadOnlyUIPort can't be null.");
	}

	const [checked, setChecked] = createSignal(uiPort.toolbarButton.checked);

	onMount(() => {
		const unsubscribe = uiPort.onToolbarButtonUpdate((state) => {
			setChecked(state.checked);
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onClick = () => {
		uiPort.emitToggle({ newState: !checked() });
	};

	return (
		<span>
			<ToolbarButton checked={checked()} onClick={onClick}>
				<Icon name="LockSimple" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
