import { useEditorContext } from "#context";

import type { EditorAreaProps } from "./EditorArea-types";

export const EditorArea = (props: EditorAreaProps) => {
  const editor = useEditorContext();

  const handlePointerDown = (event: PointerEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    event.preventDefault();

    editor.focus();
  };

  return (
    <div
      class={[
        "overflow-y-auto transition-colors focus-within:shadow-[inset_0_0_4px_-2px_color-mix(in_oklab,var(--color-neutral-400)_84%,transparent)]",
        props.class,
      ]}
      role="presentation"
      onPointerDown={handlePointerDown}
    >
      {props.children}
    </div>
  );
};
