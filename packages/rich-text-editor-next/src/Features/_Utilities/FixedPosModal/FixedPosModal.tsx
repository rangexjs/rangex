import type { JSX } from "@solidjs/web/jsx-runtime";
import { Icon } from "#ui";

interface FixedPosModalProps {
	id: string;
	title: string;
	children: JSX.Element;
	onToggle?: (event: ToggleEvent) => void;
	onClose?: (event: Event) => void;
}

export const FixedPosModal = (props: FixedPosModalProps) => {
	return (
		<dialog
			id={props.id}
			closedby="any"
			class="inset-0 m-auto w-full max-w-80 rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
			onToggle={props.onToggle}
			onClose={props.onClose}
		>
			<div class="mb-2 flex items-center justify-between">
				<h2 class="font-bold text-neutral-700 text-sm dark:text-neutral-200">
					{props.title}
				</h2>
				<button
					type="button"
					commandfor={props.id}
					command="close"
					class="p-1 text-neutral-700 hover:text-neutral-900 dark:text-neutral-200 dark:hover:text-white"
				>
					<Icon name="X" class="size-3" />
				</button>
			</div>
			<div class="mb-2 h-0.5 rounded-sm bg-neutral-300 dark:bg-neutral-700" />
			{props.children}
		</dialog>
	);
};
