import type { LineHandlerPublicPort } from "@rangex/editor/line-handler";
import type { ReactiveLineHandlerPort } from "@rangex/solid";
import { createMemo, createUniqueId } from "solid-js";
import { useUIOptionsContext } from "#context";
import { Icon } from "#ui";
import { LineButton, Menu } from "../_Utilities";
import { createLineDragMenuItems } from "./LineDragMenuItems";

interface LineDragProps {
	lineHandler: LineHandlerPublicPort;
	$lineHandler: ReactiveLineHandlerPort;
}

export const LineDrag = (props: LineDragProps) => {
	const uiOptions = useUIOptionsContext();
	const popoverId = createUniqueId();

	const items = createMemo(() =>
		createLineDragMenuItems({
			lineHandler: props.lineHandler,
			uiOptions,
			turnIntoAvailability: props.$lineHandler.turnIntoAvailability(),
			canRemove: props.$lineHandler.canRemove(),
			canDuplicate: props.$lineHandler.canDuplicate(),
			canUnwrap: props.$lineHandler.canUnwrap(),
		}),
	);

	const onDragStart = (event: DragEvent) => {
		props.lineHandler.dragStart(event);
	};

	return (
		<span>
			<LineButton
				commandfor={popoverId}
				command="toggle-popover"
				draggable="true"
				aria-label="Line options"
				onDragStart={onDragStart}
			>
				<Icon name="DotsSixVertical" class="size-3" />
			</LineButton>

			<Menu mainPopoverId={popoverId} popoverId={popoverId} items={items()} />
		</span>
	);
};
