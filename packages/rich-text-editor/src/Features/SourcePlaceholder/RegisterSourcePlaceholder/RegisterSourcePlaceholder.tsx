import { render } from "@solidjs/web";
import { SourcePlaceholderSlot } from "../SourcePlaceholderSlot";
import type { RegisterSourcePlaceholderParams } from "./RegisterSourcePlaceholder-types";

/*
 * Renders an SourcePlaceholderSlot into every placeholder the editor creates, with the given settings.
 */
export const registerSourcePlaceholder = ({
	editor,
	settings,
}: RegisterSourcePlaceholderParams) => {
	if (!editor.sourcePlaceholder) {
		throw new Error("SourcePlaceholder can't be undefined.");
	}

	editor.sourcePlaceholder.registerSlottedElement((container) => {
		const dispose = render(
			() => (
				<SourcePlaceholderSlot
					editor={editor}
					container={container}
					settings={settings}
				/>
			),
			container,
		);

		return () => {
			dispose();
		};
	});
};
