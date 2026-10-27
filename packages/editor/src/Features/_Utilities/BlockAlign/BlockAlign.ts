import { blockAlignAttr } from "#constants";
import type {
	GetBlockAlignParams,
	GetBlockAlignResult,
	SetBlockAlignParams,
} from "./BlockAlign-types";

const alignValues: string[] = Object.values(blockAlignAttr.value);

const isBlockAlignValue = (value: string): value is GetBlockAlignResult =>
	alignValues.includes(value);

/*
 * Reads the current block alignment off a `BlockComponentLine`, falling back to "center"
 * (and warning) if the attribute is missing or set to an invalid value.
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

/*
 * Sets which side a block's content is anchored to within its `BlockComponentLine`.
 */
export const setBlockAlign = ({
	blockComponentLine,
	align,
}: SetBlockAlignParams) => {
	blockComponentLine.$$setAttribute(
		blockAlignAttr.name,
		blockAlignAttr.value[align],
	);
};
