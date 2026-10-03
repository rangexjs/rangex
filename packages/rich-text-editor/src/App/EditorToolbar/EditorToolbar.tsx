import { dynamic } from "@solidjs/web";
import { createMemo, For, Show } from "solid-js";
import type { ToolbarButtonsLayout } from "#constants";
import type { ExtensionToolbarButtons } from "#extensions";

export interface EditorToolbarProps {
	toolbarButtonsLayout: ToolbarButtonsLayout;
	toolbarButtons: ExtensionToolbarButtons;
}

export const EditorToolbar = (props: EditorToolbarProps) => {
	// Drops buttons without a registered component, then any group or row left empty.
	const visibleLayout = createMemo(() => {
		const toolbarButtons = props.toolbarButtons;

		const rows = props.toolbarButtonsLayout.map((row) => {
			const groups = row.map((group) =>
				group.filter((name) => toolbarButtons[name]),
			);

			return groups.filter((group) => group.length > 0);
		});

		return rows.filter((row) => row.length > 0);
	});

	return (
		<div
			class={[
				"flex-col gap-1 border-neutral-200 border-b bg-white p-2 dark:border-neutral-800 dark:bg-neutral-950",
				{
					flex: visibleLayout().length > 0,
					hidden: visibleLayout().length === 0,
				},
			]}
		>
			<For each={visibleLayout()}>
				{(row) => (
					<div class="flex flex-wrap gap-1.5">
						<For each={row}>
							{(group, index) => (
								<>
									<span class="space-x-0.5">
										<For each={group}>
											{(name) => {
												const ToolbarButton = dynamic(
													() => props.toolbarButtons[name],
												);

												return <ToolbarButton />;
											}}
										</For>
									</span>
									<Show when={index() < row.length - 1}>
										<hr
											aria-orientation="vertical"
											class="h-auto w-px border-0 bg-neutral-200 dark:bg-neutral-700"
										/>
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
