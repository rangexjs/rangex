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
 * Reads the current `data-block-align` off a block's `BlockNestedContextLine`, falling back
 * to "center" (and warning) if the attribute is missing or was set to something invalid.
 */
export const getBlockAlign = ({
	blockNestedContextLine,
}: GetBlockAlignParams): GetBlockAlignResult => {
	const value = blockNestedContextLine.getAttribute(blockAlignAttr.name);

	if (value === null || !isBlockAlignValue(value)) {
		console.warn(
			"BlockNestedContextLine has a missing or invalid attribute.",
			blockAlignAttr.name,
		);

		return "center";
	}

	return value;
};

/**
 * Switches which side a block's content is anchored to within its `block-nested-context-line`,
 * driving the flex layout defined in `BlockNestedContextLine.css`.
 */
export const setBlockAlign = ({
	blockNestedContextLine,
	align,
}: SetBlockAlignParams) => {
	blockNestedContextLine.setAttribute(
		blockAlignAttr.name,
		blockAlignAttr.value[align],
	);
};
