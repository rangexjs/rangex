import { createSignal, createUniqueId } from "solid-js";
import { toolbarButtonsName } from "../../../Constants";
import {
	useEditorOptionsContext,
	useToolbarButtonManagersContext,
} from "../../App";
import { Icon } from "../../Icon";
import { Dropdown, type DropdownList, ToolbarButton } from "../_Utilities";

export const CustomComponentToolbarButton = () => {
	const { customComponentNames } = useEditorOptionsContext();

	const { toolbarButtonsActionManager, nodeInsertionButtonsStateManager } =
		useToolbarButtonManagersContext();

	const { customComponent } = nodeInsertionButtonsStateManager;

	const [checked, setChecked] = createSignal(false);
	const [disabled, setDisabled] = createSignal(customComponent.disabled);

	nodeInsertionButtonsStateManager.subscribe({
		type: toolbarButtonsName.customComponent,
		callback: (state) => setDisabled(state.disabled),
	});

	const popoverId = createUniqueId();

	const onPopoverToggle = (event: ToggleEvent) => {
		const { newState } = event;

		setChecked(newState === "open");
	};

	const list: DropdownList = customComponentNames.map((name) => {
		return {
			text: name,
			button: {
				"on:click": () => {
					toolbarButtonsActionManager.emitNodeInsertionChange({
						type: toolbarButtonsName.customComponent,
						name,
					});
				},
			},
		};
	});

	return (
		<span>
			<ToolbarButton
				checked={checked()}
				disabled={disabled()}
				commandfor={popoverId}
				command="toggle-popover"
				hasChevron={true}
			>
				<Icon name="SquaresFour" class="size-4" />
			</ToolbarButton>

			<Dropdown
				id={popoverId}
				list={list}
				class="[position-area:bottom_center]"
				onToggle={onPopoverToggle}
			/>
		</span>
	);
};
