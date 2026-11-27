import type { FileId, NodeStorage, ValidateStorageCallbackFn } from "./Utilities-types";

/*
 * Runs the given storage check and warns when the value has an unexpected shape.
 */
export const validateStorage = (storage: unknown, isStorage: ValidateStorageCallbackFn) => {
  const isValid = isStorage(storage);

  if (!isValid) {
    console.warn("Unexpected data shape", storage);
  }

  return isValid;
};

/*
 * A media file's id in the app's storage is valid if it's null (the media isn't an uploaded file) or a string that isn't
 * empty and is at most 1024 characters long.
 */
export const isFileId = (value: unknown): value is FileId => {
  const maxFileIdLength = 1024;

  if (value === null) {
    return true;
  }

  return typeof value === "string" && value !== "" && value.length <= maxFileIdLength;
};

/*
 * Checks whether a value is any node's storage object. Only the shared id is checked, so the node-specific fields are
 * trusted to match it.
 */
export const isNodeStorage = (storage: unknown): storage is NodeStorage => {
  const isValidStorage =
    typeof storage === "object" &&
    storage !== null &&
    "id" in storage &&
    typeof storage.id === "string";

  return isValidStorage;
};
