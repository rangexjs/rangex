import type { LineHandlerUIPort } from "#adapters";
import { Icon } from "../../Icon";
import { LineButton } from "./_Utilities";
import { LineDrag } from "./LineDrag";

interface LineHandlerProps {
	uiPort: LineHandlerUIPort;
}

export const LineHandler = (props: LineHandlerProps) => {
	const uiPort = props.uiPort;

	let lineDragPopover: HTMLDivElement | undefined;

	const onInsertClick = (event: MouseEvent) => {
		const position = event.altKey ? "above" : "below";
		uiPort.emitInsertRootLine(position);
	};

	const onBeforeToggle = () => {
		if (!lineDragPopover) {
			throw new Error("LineDragPopover shouldn't be undefined.");
		}

		if (lineDragPopover.matches(":popover-open")) {
			lineDragPopover.hidePopover();
		}
	};

	return (
		<div
			ref={(el) => uiPort.popover.setElement(el)}
			popover="manual"
			class="mr-2 hidden items-center gap-0.5 bg-transparent [position-area:left_span-bottom] sm:open:flex"
			on:beforetoggle={onBeforeToggle}
		>
			<LineButton
				title="Insert line below (Alt: insert above)"
				on:click={onInsertClick}
			>
				<Icon name="Plus" class="size-3" />
			</LineButton>

			<LineDrag
				uiPort={uiPort}
				popoverRef={(el) => {
					lineDragPopover = el;
				}}
			/>
		</div>
	);
};
