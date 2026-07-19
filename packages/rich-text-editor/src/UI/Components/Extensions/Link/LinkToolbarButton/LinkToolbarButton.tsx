import { createSignal, onCleanup, onMount } from "solid-js";
import type { LinkAdapter, LinkUpdateToolbarButtonFn } from "#adapters";
import { Icon } from "../../../Icon";
import { ToolbarButton } from "../../../ToolbarButtons/_Utilities";

interface LinkToolbarButtonProps {
	adapter: LinkAdapter;
}

export const LinkToolbarButton = (props: LinkToolbarButtonProps) => {
	const adapter = props.adapter;

	const [checked, setChecked] = createSignal(adapter.toolbarButton.checked);
	const [disabled, setDisabled] = createSignal(adapter.toolbarButton.disabled);

	onMount(() => {
		const callback: LinkUpdateToolbarButtonFn = (state) => {
			setChecked(state.checked);
			setDisabled(state.disabled);
		};
		adapter.subscribe({ type: "toolbarButton", callback });
		onCleanup(() => adapter.unsubscribe({ type: "toolbarButton", callback }));
	});

	const onClick = () => {
		adapter.emitToolbarClick();
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
