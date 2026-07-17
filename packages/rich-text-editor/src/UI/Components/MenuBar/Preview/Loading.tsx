import { Spinning } from "../../Spinning";

export const Loading = () => (
	<div class="flex h-full items-center justify-center p-8">
		<Spinning
			class="size-24"
			blueprintColor="var(--color-neutral-300)"
			loadingColor="var(--color-primary-500)"
			strokeWidth={2}
		/>
	</div>
);
