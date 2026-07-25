import { createSignal, onCleanup, onMount } from "solid-js";
import type { TodoListUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface CheckboxListToolbarButtonProps {
	uiPort: TodoListUIPort;
}

export const CheckboxListToolbarButton = (
	props: CheckboxListToolbarButtonProps,
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
				<Icon name="ListChecks" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
