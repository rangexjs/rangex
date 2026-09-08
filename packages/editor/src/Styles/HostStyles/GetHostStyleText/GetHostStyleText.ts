import AnchorPositioning from "../AnchorPositioning.css?inline";
import BlockResizer from "../BlockResizer.css?inline";

export const getHostStyleText = () => {
	const styleTexts: string[] = [];

	styleTexts.push(AnchorPositioning, BlockResizer);

	const hostStyleText = styleTexts.join("");

	return hostStyleText;
};
