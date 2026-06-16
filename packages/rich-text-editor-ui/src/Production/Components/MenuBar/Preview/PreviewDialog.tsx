import { createSignal, For, onCleanup, onMount } from "solid-js";
import { menuBarButtonsName } from "../../../Constants";
import type { MenuBarActionManager } from "../../../MenuBarActionManager";
import type { MenuBarButtonsStateManager } from "../../../MenuBarButtonsStateManager";
import { Icon } from "../../Icon";
import { Loading } from "./Loading";

type PreviewTab = "rendered" | "html" | "json" | "snapshot";

const tabs: { label: string; value: PreviewTab }[] = [
	{ label: "Rendered", value: "rendered" },
	{ label: "HTML", value: "html" },
	{ label: "JSON", value: "json" },
	{ label: "Snapshot", value: "snapshot" },
];

interface PreviewDialogProps {
	dialogId: string;
	menuBarActionManager: MenuBarActionManager;
	menuBarButtonsStateManager: MenuBarButtonsStateManager;
}

export const PreviewDialog = (props: PreviewDialogProps) => {
	const [activeTab, setActiveTab] = createSignal<PreviewTab>("rendered");
	const [preview, setPreview] = createSignal(
		props.menuBarButtonsStateManager.preview,
	);
	const [resolvedContent, setResolvedContent] = createSignal<
		Partial<Record<PreviewTab, HTMLElement>>
	>({});

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

	/**
	 * Resolves a tab's content the first time it's viewed. The editor's
	 * state can't change while the dialog is open, so once a tab is
	 * resolved it's reused for the rest of this open session.
	 */
	const handleTabChange = async (tab: PreviewTab) => {
		setActiveTab(tab);

		if (resolvedContent()[tab]) {
			return;
		}

		const { content } = preview();

		if (!content) {
			return;
		}

		const resolvers: Record<PreviewTab, () => Promise<HTMLElement>> = {
			rendered: content.getRendered,
			html: content.getHtml,
			json: content.getJson,
			snapshot: content.getSnapshot,
		};

		const host = await resolvers[tab]();
		setResolvedContent((current) => ({ ...current, [tab]: host }));
	};

	const handleToggle = (e: ToggleEvent) => {
		if (e.newState === "open") {
			props.menuBarActionManager.emitMenuBarChange({ type: "preview" });
			handleTabChange(activeTab());
		}

		if (e.newState === "closed") {
			setResolvedContent({});
			props.menuBarButtonsStateManager.updateState({
				preview: { content: null },
			});
		}
	};

	const tabAnchorName = "--tab-anchor-name";

	return (
		<dialog
			id={props.dialogId}
			closedby="any"
			on:toggle={handleToggle}
			class="inset-0 m-auto h-[min(100%,800px)] w-full max-w-7xl flex-col rounded-lg border border-neutral-300 bg-white p-2 shadow-md open:flex"
		>
			<div>
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
								onClick={() => handleTabChange(tab.value)}
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
			</div>
			<div class="grow overflow-auto rounded-sm border border-neutral-300 text-sm">
				<For each={tabs}>
					{(tab) => (
						<div
							class="h-full"
							classList={{ hidden: activeTab() !== tab.value }}
						>
							{resolvedContent()[tab.value] ?? <Loading />}
						</div>
					)}
				</For>
			</div>
		</dialog>
	);
};
