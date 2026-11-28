import { detectMediaFileType } from "../_Utilities";
import { createFileDropzone } from "./CreateFileDropzone";
import { createSourceResolver } from "./CreateSourceResolver";
import { SourcePicker } from "./SourcePicker";
import { NoSupportedSourceTypes } from "./NoSupportedSourceTypes";
import type { SourcePlaceholderSlotProps } from "./SourcePlaceholderSlot-types";
import { StatusIndicator } from "./StatusIndicator";

/**
 * Solid UI for an unresolved source placeholder — drag&drop anywhere on the card, or a
 * SourcePicker. Every capture goes through a source resolver, which replaces the placeholder
 * (see createSourceResolver).
 */
export const SourcePlaceholderSlot = (props: SourcePlaceholderSlotProps) => {
  const { sourcePlaceholder } = props.editor;

  if (!sourcePlaceholder) {
    throw new Error("SourcePlaceholder can't be undefined.");
  }

  const supportedSourceTypes = sourcePlaceholder.supportedSourceTypes;

  if (!supportedSourceTypes.length) {
    return <NoSupportedSourceTypes />;
  }

  const sourceResolver = createSourceResolver({
    editor: props.editor,
    sourcePlaceholder,
    container: props.container,
    settings: props.settings,
  });

  const fileDropzone = createFileDropzone({
    onFile: (file) => {
      const type = detectMediaFileType({ file, supportedSourceTypes });

      if (!type) {
        return;
      }

      sourceResolver.resolveFile(type, file);
    },
  });

  const errorMessage = () => {
    const state = sourceResolver.status();
    return state.status === "error" ? state.message : null;
  };

  const pickerVisible = () => {
    const { status } = sourceResolver.status();
    return status === "idle" || status === "error";
  };

  const stopEditorPropagation = (event: Event) => {
    event.stopPropagation();
  };

  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- drag-and-drop dropzone container; the keydown/paste/copy/cut handlers only stop propagation into the editor underneath, they aren't a real interactive control
    <div
      class={[
        "flex flex-col rounded-lg border border-dashed p-4",
        {
          "border-blue-400 bg-blue-50 dark:bg-blue-950": fileDropzone.dragActive(),
          "border-neutral-300 dark:border-neutral-700": !fileDropzone.dragActive(),
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
      <SourcePicker
        supportedSourceTypes={supportedSourceTypes}
        visible={pickerVisible()}
        errorMessage={errorMessage()}
        onSubmitFile={(type, file) => {
          sourceResolver.resolveFile(type, file);
        }}
        onSubmitUrl={(url) => {
          sourceResolver.resolveUrl(url);
        }}
      />

      <StatusIndicator status={sourceResolver.status()} />
    </div>
  );
};
