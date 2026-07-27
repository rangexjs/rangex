import { For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { ToolbarButtons, ToolbarButtonValue, UIExtension } from "#ports";

interface ToolbarButtonProps {
	name: ToolbarButtonValue;
	extensions: UIExtension[];
}

const ToolbarButton = ({ name, extensions }: ToolbarButtonProps) => {
	for (const extension of extensions) {
		const component = extension.components.toolbarButtons?.[name];

		if (component) {
			return <Dynamic component={component} />;
		}
	}

	return null;
};

export interface EditorToolbarProps {
	toolbarButtons: ToolbarButtons;
	extensions: UIExtension[];
}

export const EditorToolbar = (props: EditorToolbarProps) => {
	return (
		<div class="flex flex-col gap-1 border-neutral-200 border-b bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950">
			<For each={props.toolbarButtons}>
				{(row) => (
					<div class="flex flex-wrap gap-1.5">
						<For each={row}>
							{(group, index) => (
								<>
									<span class="space-x-0.5">
										<For each={group}>
											{(name) => (
												<ToolbarButton
													name={name}
													extensions={props.extensions}
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
