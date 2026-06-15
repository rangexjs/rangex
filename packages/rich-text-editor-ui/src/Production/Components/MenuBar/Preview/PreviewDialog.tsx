import { createSignal, For, onCleanup, onMount } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import type { MenuBarButtonsStateManager } from "../../../MenuBarButtonsStateManager";
import { Icon } from "../../Icon";

type PreviewTab = "rendered" | "html" | "json" | "snapshot";

const tabs: { label: string; value: PreviewTab }[] = [
	{ label: "Rendered", value: "rendered" },
	{ label: "HTML", value: "html" },
	{ label: "JSON", value: "json" },
	{ label: "Snapshot", value: "snapshot" },
];

interface PreviewDialogProps {
	dialogId: string;
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
}

export const PreviewDialog = (props: PreviewDialogProps) => {
	const [activeTab, setActiveTab] = createSignal<PreviewTab>("rendered");
	const [preview, setPreview] = createSignal(
		props.menuBarButtonsStateManager.preview,
	);

	onMount(() => {
		props.menuBarButtonsStateManager.subscribe({
			type: menuBarButtonsName.preview,
			callback: setPreview,
		});
	});

	onCleanup(() => {
		props.menuBarButtonsStateManager.unsubscribe({
			type: menuBarButtonsName.preview,
			callback: setPreview,
		});
	});

	const tabAnchorName = "--tab-anchor-name";

	return (
		<dialog
			id={props.dialogId}
			closedby="any"
			// temporary
			ref={(el) => setTimeout(() => el.showModal(), 200)}
			class="inset-0 m-auto w-full max-w-7xl rounded-lg border border-neutral-300 bg-white p-2 shadow-md"
		>
			<div class="mb-2 flex items-center justify-between">
				<h2 class="font-bold text-neutral-700 text-sm">Preview</h2>
				<button
					type="button"
					commandfor={props.dialogId}
					command="close"
					class="p-1 text-neutral-700 hover:text-neutral-900"
				>
					<Icon name="X" class="size-3" />
				</button>
			</div>
			<div class="mb-3 h-0.5 rounded-sm bg-neutral-300" />
			<div
				class="mb-3 border-neutral-300 border-b"
				style={{
					"anchor-scope": tabAnchorName,
				}}
			>
				<span
					class="absolute top-[anchor(top)] left-[anchor(left)] h-[calc(anchor-size(height)+1px)] w-[anchor-size(width)] border border-t-neutral-300 border-r-neutral-300 border-b-white border-l-neutral-300 transition-[left,width] duration-200"
					style={{ "position-anchor": tabAnchorName }}
				/>
				<For each={tabs}>
					{(tab) => (
						<button
							type="button"
							onClick={() => setActiveTab(tab.value)}
							class="px-2 py-1.5 font-semibold text-neutral-600 text-sm transition-colors hover:text-neutral-800 active:text-neutral-950"
							style={{
								"anchor-name":
									activeTab() === tab.value ? tabAnchorName : undefined,
							}}
						>
							{tab.label}
						</button>
					)}
				</For>
			</div>
			<div class="max-h-200 overflow-auto rounded-sm border border-neutral-300 text-sm">
				{preview().content?.[activeTab()]}
			</div>
		</dialog>
	);
};
