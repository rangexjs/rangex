import { blockAlignAttr } from "../../../Constants";
import type {
	GetBlockAlignParams,
	GetBlockAlignResult,
	SetBlockAlignParams,
} from "./BlockAlign-types";

const alignValues: string[] = Object.values(blockAlignAttr.value);

const isBlockAlignValue = (value: string): value is GetBlockAlignResult =>
	alignValues.includes(value);

/**
 * Reads the current `data-block-align` off a block's `BlockComponentLine`, falling back
 * to "center" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getBlockAlign = ({
	blockComponentLine,
}: GetBlockAlignParams): GetBlockAlignResult => {
	const value = blockComponentLine.getAttribute(blockAlignAttr.name);

	if (value === null || !isBlockAlignValue(value)) {
		console.warn(
			"BlockComponentLine has a missing or invalid attribute.",
			blockAlignAttr.name,
		);

		return "center";
	}

	return value;
};

/**
 * Switches which side a block's content is anchored to within its `block-component-line`,
 * driving the flex layout defined in `BlockComponentLine.css`.
 */
export const setBlockAlign = ({
	blockComponentLine,
	align,
}: SetBlockAlignParams) => {
	blockComponentLine.setAttribute(
		blockAlignAttr.name,
		blockAlignAttr.value[align],
	);
};
