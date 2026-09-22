import { render } from "@solidjs/web";
import type { RegisterFn } from "#extensions";
import { EmptyMediaSlot } from "../EmptyMediaSlot";

export const registerEmptyMedia: RegisterFn = (editor) => {
	if (!editor.emptyMedia) {
		throw new Error("EmptyMedia can't be undefined.");
	}

	editor.emptyMedia.registerSlottedElement((container) => {
		const dispose = render(
			() => <EmptyMediaSlot editor={editor} container={container} />,
			container,
		);

		return () => {
			dispose();
		};
	});
};
