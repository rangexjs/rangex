import { createSignal, onCleanup, onMount } from "solid-js";
import type { UpdateHandleXFn } from "../../../PopoverControllers";
import { usePopoverControllersContext } from "../../App";

interface HandleProps {
	side: "left" | "right";
}

const Handle = (props: HandleProps) => {
	const { blockResizePopoverController: controller } =
		usePopoverControllersContext();

	const [x, setX] = createSignal(controller.handleX);

	onMount(() => {
		const onX: UpdateHandleXFn = (value) => setX(value);

		controller.subscribe(onX);

		onCleanup(() => {
			controller.unsubscribe(onX);
		});
	});

	let handle: HTMLDivElement | undefined;

	const onPointerDown = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		handle.setPointerCapture(event.pointerId);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (!handle.hasPointerCapture(event.pointerId)) {
			return;
		}

		const handleRect = handle.getBoundingClientRect();
		const cornerX = handleRect.left + handleRect.width / 2;
		const rawDeltaPx = event.clientX - cornerX;

		const deltaSign = { left: -1, right: 1 }[props.side];
		const deltaPx = deltaSign * rawDeltaPx;

		controller.emitResizeMove({ deltaPx, side: props.side });
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (!handle.hasPointerCapture(event.pointerId)) {
			return;
		}

		handle.releasePointerCapture(event.pointerId);
		controller.emitResizeEnd();
	};

	const onPointerCancel = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (handle.hasPointerCapture(event.pointerId)) {
			handle.releasePointerCapture(event.pointerId);
		}

		controller.emitResizeEnd();
	};

	return (
		<div
			ref={handle}
			class="pointer-events-auto absolute top-1/2 h-8 w-1.5 -translate-y-1/2 cursor-ew-resize rounded-full bg-primary-500"
			classList={{
				"-translate-x-1/2": props.side === "left",
				"translate-x-1/2": props.side === "right",
			}}
			style={{ [props.side]: `${x()}px` }}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerCancel}
		/>
	);
};

export const BlockResizePopover = () => {
	const { blockResizePopoverController: controller } =
		usePopoverControllersContext();

	return (
		<div
			ref={(el) => controller.setPopover(el)}
			popover="manual"
			class="pointer-events-none h-[anchor-size(height)] w-[anchor-size(width)] overflow-visible border-none bg-transparent p-0 [position-area:center]"
		>
			<Handle side="left" />
			<Handle side="right" />
		</div>
	);
};
