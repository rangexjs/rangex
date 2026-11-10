import { detectMediaFileType } from "../_Utilities";
import { createFileDropzone } from "./CreateFileDropzone";
import { createMediaResolver } from "./CreateMediaResolver";
import { MediaSourcePicker } from "./MediaSourcePicker";
import { NoSupportedMediaTypes } from "./NoSupportedMediaTypes";
import type { SourcePlaceholderSlotProps } from "./SourcePlaceholderSlot-types";
import { StatusIndicator } from "./StatusIndicator";

/**
 * Solid UI for an unresolved media placeholder — drag&drop anywhere on the card, or a
 * MediaSourcePicker. Every capture goes through a media resolver, which replaces the placeholder
 * (see createMediaResolver).
 */
export const SourcePlaceholderSlot = (props: SourcePlaceholderSlotProps) => {
	const { sourcePlaceholder } = props.editor;

	if (!sourcePlaceholder) {
		throw new Error("SourcePlaceholder can't be undefined.");
	}

	const supportedMediaTypes = sourcePlaceholder.supportedMediaTypes;

	if (!supportedMediaTypes.length) {
		return <NoSupportedMediaTypes />;
	}

	const mediaResolver = createMediaResolver({
		editor: props.editor,
		sourcePlaceholder,
		container: props.container,
		settings: props.settings,
	});

	const fileDropzone = createFileDropzone({
		onFile: (file) => {
			const type = detectMediaFileType({ file, supportedMediaTypes });

			if (!type) {
				return;
			}

			mediaResolver.resolveFile(type, file);
		},
	});

	const errorMessage = () => {
		const state = mediaResolver.status();
		return state.status === "error" ? state.message : null;
	};

	const pickerVisible = () => {
		const { status } = mediaResolver.status();
		return status === "idle" || status === "error";
	};

	const stopEditorPropagation = (event: Event) => {
		event.stopPropagation();
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop dropzone container; the keydown/paste/copy/cut handlers only stop propagation into the editor underneath, they aren't a real interactive control
		<div
			class={[
				"flex flex-col rounded-lg border border-dashed p-4",
				{
					"border-blue-400 bg-blue-50 dark:bg-blue-950":
						fileDropzone.dragActive(),
					"border-neutral-300 dark:border-neutral-700":
						!fileDropzone.dragActive(),
				},
			]}
			onDragEnter={fileDropzone.onDragEnter}
			onDragOver={fileDropzone.onDragOver}
			onDragLeave={fileDropzone.onDragLeave}
			onDrop={fileDropzone.onDrop}
			onKeyDown={stopEditorPropagation}
			onBeforeInput={stopEditorPropagation}
			onPointerDown={stopEditorPropagation}
			onPaste={stopEditorPropagation}
			onCopy={stopEditorPropagation}
			onCut={stopEditorPropagation}
		>
			<MediaSourcePicker
				supportedMediaTypes={supportedMediaTypes}
				visible={pickerVisible()}
				errorMessage={errorMessage()}
				onSubmitFile={(type, file) => {
					mediaResolver.resolveFile(type, file);
				}}
				onSubmitUrl={(url) => {
					mediaResolver.resolveUrl(url);
				}}
			/>

			<StatusIndicator status={mediaResolver.status()} />
		</div>
	);
};
