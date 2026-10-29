import type { LinkConfigPort, PlacementValidationParams } from "#adapters/Link";
import type { LinkAttrsMismatch } from "#dom-attrs";

export interface ValidateLinkPlacementParams extends PlacementValidationParams {
	configPort: LinkConfigPort;
}

export type ValidateLinkPlacementResult = LinkAttrsMismatch | null;
