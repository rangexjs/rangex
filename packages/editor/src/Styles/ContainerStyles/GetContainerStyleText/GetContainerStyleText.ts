import AnchorPositioning from "../AnchorPositioning.css?inline";
import BlockResizer from "../BlockResizer.css?inline";
import EditorContainer from "../EditorContainer.css?inline";

export const getContainerStyleText = () => {
  const styleTexts: string[] = [];

  styleTexts.push(AnchorPositioning, BlockResizer, EditorContainer);

  const containerStyleText = styleTexts.join("");

  return containerStyleText;
};
