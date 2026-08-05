import type { LineHandlerUIPort } from "#adapters";
import { Icon } from "../../Icon";
import { LineButton } from "./_Utilities";
import { LineDrag } from "./LineDrag";

interface LineHandlerProps {
	uiPort: LineHandlerUIPort;
}

export const LineHandler = (props: LineHandlerProps) => {
	const uiPort = props.uiPort;

	const onInsertClick = (event: MouseEvent) => {
		const position = event.altKey ? "above" : "below";
		uiPort.emitInsertRootLine(position);
	};

	return (
		<div
			ref={(el) => uiPort.anchoredOverlay.setElement(el)}
			class="z-10 hidden items-center gap-0.5 bg-transparent sm:flex"
			style={{ transition: "top 200ms ease-out" }}
		>
			<LineButton
				title="Insert line below (Alt: insert above)"
				on:click={onInsertClick}
			>
				<Icon name="Plus" class="size-3" />
			</LineButton>

			<LineDrag uiPort={uiPort} />
		</div>
	);
};
