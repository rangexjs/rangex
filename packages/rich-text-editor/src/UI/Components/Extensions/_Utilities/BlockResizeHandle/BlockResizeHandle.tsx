import { createSignal, onCleanup, onMount } from "solid-js";
import type { UIBlockResize } from "#adapters";
import type { BlockResizeHandleProps } from "./BlockResizeHandle-types";

interface HandleProps {
	uiBlockResize: UIBlockResize;
	side: "left" | "right";
}

const Handle = (props: HandleProps) => {
	const [x, setX] = createSignal(props.uiBlockResize.handleX);

	onMount(() => {
		const unsubscribe = props.uiBlockResize.onHandleXUpdate(setX);

		onCleanup(() => {
			unsubscribe();
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

		props.uiBlockResize.emitResizeMove({ deltaPx, side: props.side });
	};

	const onPointerUp = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (!handle.hasPointerCapture(event.pointerId)) {
			return;
		}

		handle.releasePointerCapture(event.pointerId);
		props.uiBlockResize.emitResizeEnd();
	};

	const onPointerCancel = (event: PointerEvent) => {
		if (!handle) {
			throw new Error("Handle can't be undefined.");
		}

		if (handle.hasPointerCapture(event.pointerId)) {
			handle.releasePointerCapture(event.pointerId);
		}

		props.uiBlockResize.emitResizeEnd();
	};

	return (
		<div
			ref={handle}
			class="pointer-events-auto absolute top-1/2 h-12 w-2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-neutral-700 border-solid bg-neutral-200/70 dark:border-neutral-200 dark:bg-neutral-700/70"
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

export const BlockResizeHandle = (props: BlockResizeHandleProps) => {
	return (
		<div
			ref={(el) => props.uiBlockResize.setElement(el)}
			popover="manual"
			class="pointer-events-none h-[anchor-size(height)] w-[anchor-size(width)] overflow-visible border-none bg-transparent p-0 [position-area:center]"
		>
			<Handle uiBlockResize={props.uiBlockResize} side="left" />
			<Handle uiBlockResize={props.uiBlockResize} side="right" />
		</div>
	);
};
