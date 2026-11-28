import { getContainerStyleText } from "../../Styles";
import type {
  CreateEditorContainerParams,
  CreateEditorContainerResult,
} from "./CreateEditorContainer-types";

/*
 * Builds the element the consumer mounts: the engine's host, followed by the container the Adapters render their
 * floating UI into. The returned style text is for the document or shadow root holding it.
 */
export const createEditorContainer = ({
  editorAPI,
}: CreateEditorContainerParams): CreateEditorContainerResult => {
  const { host } = editorAPI;

  const floatingContainer = document.createElement("div");

  const editorContainer = document.createElement("div");
  editorContainer.classList.add("editor-container");
  editorContainer.append(host, floatingContainer);

  const containerStyles = getContainerStyleText();

  return { editorContainer, floatingContainer, containerStyles };
};
