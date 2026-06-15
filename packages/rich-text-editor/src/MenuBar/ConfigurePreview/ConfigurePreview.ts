import { createSnapshotView } from "rich-text-area";
import type { ConfigurePreviewParams } from "./ConfigurePreview-types";
import { createHTMLFromSnapshotView } from "./CreateHTMLFromSnapshotView";

export const configurePreview = ({
	richTextEditorUI,
	editorAPI,
}: ConfigurePreviewParams) => {
	richTextEditorUI.onMenuBar((params) => {
		if (params.type !== "preview-as") {
			return;
		}

		const storedSnapshot = editorAPI.createStoredSnapshot();
		const { snapshotView } = createSnapshotView({ storedSnapshot });
		const { style, rootElement } = createHTMLFromSnapshotView({ snapshotView });
		const host = document.createElement("div");
		const shadowRoot = host.attachShadow({ mode: "open" });
		shadowRoot.append(style, rootElement);

		richTextEditorUI.updateMenuBarButtonState({
			preview: {
				content: { rendered: host, html: host, json: host, snapshot: host },
			},
		});
	});
};
