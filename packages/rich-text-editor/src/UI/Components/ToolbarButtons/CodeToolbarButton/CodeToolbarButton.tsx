import { createMemo, createSignal } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import { useToolbarButtonManagersContext } from "../../App";
import { Icon } from "../../Icon";
import { ToolbarButton } from "../_Utilities";

export const CodeToolbarButton = () => {
	const { formatStylesButtonsStateManager, toolbarButtonsActionManager } =
		useToolbarButtonManagersContext();

	const { code } = formatStylesButtonsStateManager;

	const [disabled, setDisabled] = createSignal(code.disabled);
	const [pressed, setPressed] = createSignal(code.pressed);

	const checked = createMemo(
		() => pressed() === "true" || pressed() === "mixed",
	);

	formatStylesButtonsStateManager.subscribe({
		type: toolbarButtonsName.code,
		callback: (state) => {
			setDisabled(state.disabled);
			setPressed(state.pressed);
		},
	});

	const onClick = () => {
		toolbarButtonsActionManager.emitFormatStylesChange({ code: pressed() });
	};

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				onClick={onClick}
				aria-pressed={pressed()}
			>
				<Icon name="Code" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
