import { render } from "@solidjs/web";
import { EmptyMediaSlot } from "../EmptyMediaSlot";
import type { RegisterEmptyMediaParams } from "./RegisterEmptyMedia-types";

/*
 * Renders an EmptyMediaSlot into every placeholder the editor creates, with the given settings.
 */
export const registerEmptyMedia = ({
	editor,
	settings,
}: RegisterEmptyMediaParams) => {
	if (!editor.emptyMedia) {
		throw new Error("EmptyMedia can't be undefined.");
	}

	editor.emptyMedia.registerSlottedElement((container) => {
		const dispose = render(
			() => (
				<EmptyMediaSlot
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
