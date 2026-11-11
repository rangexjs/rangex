import { FloatingPortal, LineHandler, ReadOnly } from "@rangex/solid";
import { createMemo } from "solid-js";

import { useEditorContext } from "#context";
import { Icon } from "#ui";

import { LineButton } from "./_Utilities";
import { LineDrag } from "./LineDrag";

export const LineHandlerOverlay = () => {
	const editor = useEditorContext();
	const { lineHandler, readOnly } = editor;

	if (!lineHandler) {
		throw new Error("LineHandler can't be undefined.");
	}

	const $lineHandler = LineHandler(lineHandler);
	const $readOnly = ReadOnly(readOnly);

	const onInsertClick = (event: MouseEvent) => {
		const position = event.altKey ? "above" : "below";
		lineHandler.insertRootLine(position);
	};

	const visible = createMemo(() => !$readOnly?.checked());

	return (
		<FloatingPortal
			mount={lineHandler.element}
			class={[
				"z-10 hidden items-center gap-0.5 bg-transparent transition-[top] duration-200 ease-[ease-out]",
				{ "sm:flex": visible() },
			]}
		>
			<LineButton aria-label="Insert line below" onClick={onInsertClick}>
				<Icon name="Plus" class="size-3" />
			</LineButton>

			<LineDrag lineHandler={lineHandler} $lineHandler={$lineHandler} />
		</FloatingPortal>
	);
};
