import { createSignal, onCleanup, onMount } from "solid-js";
import type { ListUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface UnorderedListToolbarButtonProps {
	uiPort: ListUIPort;
}

export const UnorderedListToolbarButton = (
	props: UnorderedListToolbarButtonProps,
) => {
	const uiPort = props.uiPort;

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
