import { render } from "@solidjs/web";
import type { RegisterFn } from "#extensions";
import { EmptyMediaSlot } from "../EmptyMediaSlot";

export const registerEmptyMedia: RegisterFn = ({ reactiveEditor }) => {
	const { emptyMedia } = reactiveEditor;

	if (!emptyMedia) {
		throw new Error("EmptyMedia can't be undefined.");
	}

	emptyMedia.registerSlottedElement((container) => {
		const dispose = render(
			() => (
				<EmptyMediaSlot reactiveEditor={reactiveEditor} container={container} />
			),
			container,
		);

		return () => {
			dispose();
		};
	});
};
