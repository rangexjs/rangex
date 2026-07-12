import { getImageDropzone } from "../GetImageElements";
import type {
	IsImageEmptyParams,
	IsImageEmptyResult,
} from "./IsImageEmpty-types";

export const isImageEmpty = ({
	figure,
}: IsImageEmptyParams): IsImageEmptyResult => {
	return !!getImageDropzone({ figure });
};
