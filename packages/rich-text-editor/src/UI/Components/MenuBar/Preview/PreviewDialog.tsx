import { createMemo, createSignal, For, onCleanup, onMount } from "solid-js";
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

interface ResolvedTabContent {
	element: HTMLElement;
	text: string | null;
}

type ResolvedContent = Partial<Record<PreviewTab, ResolvedTabContent>>;

type DownloadMeta = Partial<Record<PreviewTab, { ext: string; mime: string }>>;

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
	const [resolvedContent, setResolvedContent] = createSignal<ResolvedContent>(
		{},
	);
	const [copied, setCopied] = createSignal(false);

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
			html: content.getHTML,
			json: content.getJSON,
			snapshot: content.getSnapshot,
		};

		const textResolvers: Partial<Record<PreviewTab, () => Promise<string>>> = {
			html: content.getHTMLText,
			json: content.getJSONText,
			snapshot: content.getSnapshotText,
		};

		const element = await resolvers[tab]();
		const text = (await textResolvers[tab]?.()) ?? null;
		setResolvedContent((current) => ({ ...current, [tab]: { element, text } }));
	};

	const handleToggle = (e: ToggleEvent) => {
		if (e.newState === "open") {
			setResolvedContent({});
			props.menuBarButtonsStateManager.updateState({
				preview: { content: null },
			});

			props.menuBarActionManager.emitMenuBarChange({ type: "preview" });
			handleTabChange(activeTab());
		}
	};

	const tabAnchorName = "--tab-anchor-name";

	const getTabText = (): string | null => {
		const tab = activeTab();
		const resolved = resolvedContent()[tab];
		return resolved?.text ?? null;
	};

	const onCopyClick = (() => {
		let timeoutId = NaN;
		return () => {
			const text = getTabText();
			if (text === null) {
				return;
			}
			navigator.clipboard.writeText(text);
			setCopied(true);
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => setCopied(false), 1200);
		};
	})();

	const showActions = createMemo(() => {
		const text = getTabText();
		return text !== null;
	});

	const downloadMeta: DownloadMeta = {
		html: { ext: "html", mime: "text/html" },
		json: { ext: "json", mime: "application/json" },
		snapshot: { ext: "json", mime: "application/json" },
	};

	const onDownloadClick = () => {
		const text = getTabText();
		if (text === null) {
			return;
		}
		const tab = activeTab();
		const meta = downloadMeta[tab];
		if (!meta) {
			return;
		}
		const blob = new Blob([text], { type: meta.mime });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${tab}.${meta.ext}`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const actionAnchorName = "--action-anchor-name";

	return (
		<dialog
			id={props.dialogId}
			closedby="any"
			on:toggle={handleToggle}
			class="inset-0 m-auto h-[min(100%,800px)] w-full max-w-7xl flex-col rounded-lg border border-neutral-300 bg-white p-2 shadow-md open:flex dark:border-neutral-700 dark:bg-neutral-900"
		>
			<div>
				<div class="mb-2 flex items-center justify-between">
					<h2 class="font-bold text-neutral-700 text-sm dark:text-neutral-200">
						Preview
					</h2>
					<button
						type="button"
						commandfor={props.dialogId}
						command="close"
						class="p-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
					>
						<Icon name="X" class="size-3" />
					</button>
				</div>
				<div class="mb-3 h-0.5 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
				<div
					class="mb-3 border-neutral-300 border-b dark:border-neutral-700"
					style={{
						"anchor-scope": tabAnchorName,
					}}
				>
					<span
						class="absolute top-[anchor(top)] left-[anchor(left)] h-[calc(anchor-size(height)+1px)] w-[anchor-size(width)] border border-t-neutral-300 border-r-neutral-300 border-b-white border-l-neutral-300 transition-[left,width] duration-200 dark:border-t-neutral-700 dark:border-r-neutral-700 dark:border-b-neutral-900 dark:border-l-neutral-700"
						style={{ "position-anchor": tabAnchorName }}
					/>
					<For each={tabs}>
						{(tab) => (
							<button
								type="button"
								onClick={() => handleTabChange(tab.value)}
								class="px-2 py-1.5 font-semibold text-neutral-600 text-sm transition-colors hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:text-neutral-100"
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
			<div
				class="relative grow overflow-auto rounded-sm border border-neutral-300 text-sm dark:border-neutral-700"
				style={{
					"anchor-scope": actionAnchorName,
					"anchor-name": actionAnchorName,
				}}
			>
				<For each={tabs}>
					{(tab) => (
						<div
							class="h-full"
							classList={{ hidden: activeTab() !== tab.value }}
						>
							{resolvedContent()[tab.value]?.element ?? <Loading />}
						</div>
					)}
				</For>

				<div
					class="fixed top-[calc(anchor(top)+6px)] right-[calc(anchor(right)+24px)] flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900"
					classList={{ hidden: !showActions() }}
					style={{ "position-anchor": actionAnchorName }}
				>
					<button
						type="button"
						class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
						title="Copy"
						on:click={onCopyClick}
					>
						<Icon name={copied() ? "Check" : "CopySimple"} class="size-4" />
					</button>
					<button
						type="button"
						class="flex items-center justify-center rounded p-1 text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-neutral-800 active:text-neutral-950 dark:text-neutral-300 dark:active:text-white dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
						title="Download"
						on:click={onDownloadClick}
					>
						<Icon name="FileArrowDown" class="size-4" />
					</button>
				</div>
			</div>
		</dialog>
	);
};
