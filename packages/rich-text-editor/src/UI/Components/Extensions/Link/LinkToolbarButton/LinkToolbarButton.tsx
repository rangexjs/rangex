import { createSignal, onCleanup, onMount } from "solid-js";
import type { LinkUIPort, LinkUpdateToolbarButtonFn } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface LinkToolbarButtonProps {
	uiPort: LinkUIPort;
}

export const LinkToolbarButton = (props: LinkToolbarButtonProps) => {
	const uiPort = props.uiPort;

	const [checked, setChecked] = createSignal(uiPort.toolbarButton.checked);
	const [disabled, setDisabled] = createSignal(uiPort.toolbarButton.disabled);

	onMount(() => {
		const callback: LinkUpdateToolbarButtonFn = (state) => {
			setChecked(state.checked);
			setDisabled(state.disabled);
		};
		uiPort.subscribe({ type: "toolbarButton", callback });
		onCleanup(() => uiPort.unsubscribe({ type: "toolbarButton", callback }));
	});

	const onClick = () => {
		uiPort.emitToolbarClick();
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
			>
				<Icon name="SimpleLink" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
