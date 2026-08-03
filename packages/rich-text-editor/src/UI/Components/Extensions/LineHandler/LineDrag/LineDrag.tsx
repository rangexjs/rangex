import {
	createMemo,
	createSignal,
	createUniqueId,
	onCleanup,
	onMount,
} from "solid-js";
import type { LineHandlerUIPort } from "#adapters";
import { Icon } from "../../../Icon";
import { LineButton, Menu } from "../_Utilities";
import { createLineDragMenuItems } from "./LineDragMenuItems";

interface LineDragProps {
	uiPort: LineHandlerUIPort;
	popoverRef?: (element: HTMLDivElement) => void;
}

/**
 * The drag-handle button and its Turn Into/Delete/Duplicate menu, entirely self-contained — the
 * adapter only ever sees `emitDelete`/`emitDuplicate`/`emitDragStart`, never this popover's
 * element. `commandfor`/`command="toggle-popover"` makes the button its implicit CSS anchor, so
 * `position-area` alone is enough to place the menu, no `source`/JS positioning needed.
 * Uses this extension's own {@link Menu} — a local copy of the MenuBar dropdown menu, not a
 * shared import — for Delete/Duplicate, so submenu support is available for free (used by Turn
 * Into). The item list is rebuilt from `uiPort`'s pushed state on every update, so entries
 * invalid for the currently hovered line — and the "Turn Into" submenu itself, when nothing is
 * valid — drop out entirely rather than showing disabled.
 */
export const LineDrag = (props: LineDragProps) => {
	const uiPort = props.uiPort;

	const popoverId = createUniqueId();

	let menuElement: HTMLDivElement | undefined;

	const [turnInto, setTurnInto] = createSignal(uiPort.turnInto);
	const [canDelete, setCanDelete] = createSignal(uiPort.canDelete);
	const [canDuplicate, setCanDuplicate] = createSignal(uiPort.canDuplicate);
	const [canUnwrap, setCanUnwrap] = createSignal(uiPort.canUnwrap);

	onMount(() => {
		if (menuElement) {
			props.popoverRef?.(menuElement);
		}

		const unsubscribeTurnInto = uiPort.onTurnIntoUpdate(setTurnInto);
		const unsubscribeCanDelete = uiPort.onCanDeleteUpdate(setCanDelete);
		const unsubscribeCanDuplicate =
			uiPort.onCanDuplicateUpdate(setCanDuplicate);
		const unsubscribeCanUnwrap = uiPort.onCanUnwrapUpdate(setCanUnwrap);

		onCleanup(() => {
			unsubscribeTurnInto();
			unsubscribeCanDelete();
			unsubscribeCanDuplicate();
			unsubscribeCanUnwrap();
		});
	});

	const onDragStart = (event: DragEvent) => {
		uiPort.emitDragStart(event);
	};

	const items = createMemo(() =>
		createLineDragMenuItems({
			uiPort,
			turnInto: turnInto(),
			canDelete: canDelete(),
			canDuplicate: canDuplicate(),
			canUnwrap: canUnwrap(),
		}),
	);

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
				items={items()}
			/>
		</span>
	);
};
