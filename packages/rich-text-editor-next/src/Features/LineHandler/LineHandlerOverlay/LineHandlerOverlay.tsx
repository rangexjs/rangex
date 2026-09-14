import { LineHandler } from "@rangex/solid";
import { Portal } from "@solidjs/web";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { LineButton } from "./_Utilities";
import { LineDrag } from "./LineDrag";

export const LineHandlerOverlay = () => {
	const editor = useEditorContext();
	const lineHandler = LineHandler(editor.lineHandler);

	if (!(lineHandler && editor.lineHandler)) {
		throw new Error("LineHandler can't be undefined.");
	}

	lineHandler.element.classList.add(
		..."z-10 hidden items-center gap-0.5 bg-transparent sm:flex".split(" "),
	);

	lineHandler.element.style.transition = "top 200ms ease-out";

	const onInsertClick = (event: MouseEvent) => {
		const position = event.altKey ? "above" : "below";
		lineHandler.insertRootLine(position);
	};

	return (
		<Portal mount={lineHandler.element}>
			<LineButton
				title="Insert line below (Alt: insert above)"
				onClick={onInsertClick}
			>
				<Icon name="Plus" class="size-3" />
			</LineButton>

			<LineDrag lineHandler={lineHandler} />
		</Portal>
	);
};
