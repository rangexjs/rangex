import { Dynamic } from "@solidjs/web";
import { For, Show } from "solid-js";
import type { ToolbarButtonsLayout, ToolbarButtonValue } from "#constants";
import type { ExtensionToolbarButtons } from "#extensions";

interface ToolbarButtonSlotProps {
	name: ToolbarButtonValue;
	toolbarButtons: ExtensionToolbarButtons;
}

const ToolbarButtonSlot = ({
	name,
	toolbarButtons,
}: ToolbarButtonSlotProps) => {
	const component = toolbarButtons[name];

	if (component) {
		return <Dynamic component={component} />;
	}

	return null;
};

export interface EditorToolbarProps {
	toolbarButtonsLayout: ToolbarButtonsLayout;
	toolbarButtons: ExtensionToolbarButtons;
}

export const EditorToolbar = (props: EditorToolbarProps) => {
	return (
		<div class="flex flex-col gap-1 border-neutral-200 border-b bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950">
			<For each={props.toolbarButtonsLayout}>
				{(row) => (
					<div class="flex flex-wrap gap-1.5">
						<For each={row}>
							{(group, index) => (
								<>
									<span class="space-x-0.5">
										<For each={group}>
											{(name) => (
												<ToolbarButtonSlot
													name={name}
													toolbarButtons={props.toolbarButtons}
												/>
											)}
										</For>
									</span>
									<Show when={index() < row.length - 1}>
										<span class="w-px bg-neutral-200 dark:bg-neutral-700" />
									</Show>
								</>
							)}
						</For>
					</div>
				)}
			</For>
		</div>
	);
};
