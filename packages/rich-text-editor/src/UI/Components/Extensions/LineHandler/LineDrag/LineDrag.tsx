import { createUniqueId, onMount } from "solid-js";
import type { LineHandlerUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { LineButton, Menu } from "../_Utilities";
import { createLineDragMenuItems } from "./LineDragMenuItems";

interface LineDragProps {
	uiPort: LineHandlerUIPort;
	popoverRef?: (element: HTMLDivElement) => void;
}

/**
 * The drag-handle button and its Delete/Duplicate menu, entirely self-contained — the adapter
 * only ever sees `emitDelete`/`emitDuplicate`/`emitDragStart`, never this popover's element.
 * `commandfor`/`command="toggle-popover"` makes the button its implicit CSS anchor, so
 * `position-area` alone is enough to place the menu, no `source`/JS positioning needed.
 * Uses this extension's own {@link Menu} — a local copy of the MenuBar dropdown menu, not a
 * shared import — for Delete/Duplicate, so submenu support is available for free if a future
 * entry needs one.
 */
export const LineDrag = (props: LineDragProps) => {
	const uiPort = props.uiPort;

	const popoverId = createUniqueId();

	let menuElement: HTMLDivElement | undefined;

	onMount(() => {
		if (menuElement) {
			props.popoverRef?.(menuElement);
		}
	});

	const onDragStart = (event: DragEvent) => {
		uiPort.emitDragStart(event);
	};

	const items = createLineDragMenuItems({ uiPort });

	return (
		<span>
			<LineButton
				commandfor={popoverId}
				command="toggle-popover"
				draggable={true}
				title="Drag to move, click to open menu"
				on:dragstart={onDragStart}
			>
				<Icon name="DotsSixVertical" class="size-3" />
			</LineButton>

			<Menu
				ref={menuElement}
				mainPopoverId={popoverId}
				popoverId={popoverId}
				items={items}
			/>
		</span>
	);
};
