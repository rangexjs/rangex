import { validateLinkPlacement } from "../_Utilities";
import type { HandlePlacementValidatorRegistrationParams } from "./HandlePlacementValidatorRegistration-types";

/*
 * Registers the placement validator on the config port, the same validation the insertion runs before placing a link.
 */
export const handlePlacementValidatorRegistration = ({
	configPort,
}: HandlePlacementValidatorRegistrationParams) => {
	configPort.registerPlacementValidator(({ attrs }) =>
		validateLinkPlacement({ configPort, attrs }),
	);
};
