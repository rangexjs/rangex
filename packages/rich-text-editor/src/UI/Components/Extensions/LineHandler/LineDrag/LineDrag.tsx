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
}

export const LineDrag = (props: LineDragProps) => {
	const uiPort = props.uiPort;

	const popoverId = createUniqueId();

	const [turnInto, setTurnInto] = createSignal(uiPort.turnInto);
	const [canDelete, setCanDelete] = createSignal(uiPort.canDelete);
	const [canDuplicate, setCanDuplicate] = createSignal(uiPort.canDuplicate);
	const [canUnwrap, setCanUnwrap] = createSignal(uiPort.canUnwrap);

	onMount(() => {
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

			<Menu mainPopoverId={popoverId} popoverId={popoverId} items={items()} />
		</span>
	);
};
