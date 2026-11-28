import type { ConfigureReadOnlyParams } from "./ConfigureReadOnly-types";

/*
 * Makes the editor read-only if it starts so, syncs the read-only state with the editor's editability and wires up
 * toggling it, returning a cleanup function.
 */
export const configureReadOnly = ({ configPort, editorAPI }: ConfigureReadOnlyParams) => {
  if (configPort.initialEnabled) {
    editorAPI.setIsTextAreaEditable(false);
  }

  configPort.updateState({ isEnabled: !editorAPI.getIsTextAreaEditable() });

  const unsubscribe = configPort.onToggle(({ isEnabled, force }) => {
    const nextIsEnabled = force ?? !isEnabled;

    editorAPI.setIsTextAreaEditable(!nextIsEnabled);
    configPort.updateState({ isEnabled: nextIsEnabled });
  });

  return () => {
    unsubscribe();
  };
};
