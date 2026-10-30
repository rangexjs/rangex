import { Icon } from "#ui";

export const NoSupportedMediaTypes = () => (
	<div class="flex flex-col items-center gap-1 rounded-lg border border-neutral-300 border-dashed p-4 text-center text-neutral-500 text-sm dark:border-neutral-700 dark:text-neutral-400">
		<Icon name="WarningCircle" class="size-6" />
		<span>No media types are available</span>
		<span class="text-xs">
			This editor has no Image, Video, Audio, or Embed extension registered —
			add at least one to the `extensions` array passed to createRichTextEditor
			to enable media insertion.
		</span>
	</div>
);
