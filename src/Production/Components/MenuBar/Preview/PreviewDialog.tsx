import { type Accessor, createEffect, createSignal } from "solid-js";

type PreviewFormat = "html" | "html-like-json" | "editor-json";

// biome-ignore lint/correctness/noUnusedVariables: Will be implemented soon
const tabs: { label: string; value: PreviewFormat }[] = [
	{ label: "HTML", value: "html" },
	{ label: "HTML-like JSON", value: "html-like-json" },
	{ label: "Editor JSON", value: "editor-json" },
];

interface PreviewDialogProps {
	open: Accessor<boolean>;
	onClose: () => void;
}

export const PreviewDialog = (props: PreviewDialogProps) => {
	let dialog!: HTMLDialogElement;
	// biome-ignore lint/correctness/noUnusedVariables: Will be implemented soon
	const [activeTab, setActiveTab] = createSignal<PreviewFormat>("html");

	createEffect(() => {
		if (props.open()) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});

	return (
		<dialog
			ref={dialog}
			class="rounded-xl border border-neutral-200 bg-white p-0 shadow-lg backdrop:bg-black/20"
			on:close={props.onClose}
		>
			{/* Will be implemented soon */}
		</dialog>
	);
};
