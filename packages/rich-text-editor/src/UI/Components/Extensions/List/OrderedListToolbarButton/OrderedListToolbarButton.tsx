import { createSignal, onCleanup, onMount } from "solid-js";
import type { ListUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface OrderedListToolbarButtonProps {
	uiPort: ListUIPort;
}

export const OrderedListToolbarButton = (
	props: OrderedListToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

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
