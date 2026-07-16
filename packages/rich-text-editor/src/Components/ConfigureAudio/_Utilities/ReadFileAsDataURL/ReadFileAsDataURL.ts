import type { ReadFileAsDataURLResult } from "./ReadFileAsDataURL-types";

export const readFileAsDataURL = (file: File): ReadFileAsDataURLResult => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result !== "string") {
				reject(new Error("FileReader result must be a string."));
				return;
			}

			resolve(reader.result);
		};

		reader.onerror = () => {
			reject(reader.error ?? new Error("Failed to read file."));
		};

		reader.readAsDataURL(file);
	});
};
