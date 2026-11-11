import { isComponentDraft } from "@rangex/core";

import { formatNodePath } from "../_Utilities";
import type {
	ValidateComponentsParams,
	ValidateComponentsResult,
} from "./ValidateComponents-types";

/*
 * Validates every component in the RootEditable, nested ones included, by the validator registered for its name. A
 * component without a validator is invalid. Fails on the first component that doesn't pass.
 */
export const validateComponents = ({
	rootEditableDraft,
	componentValidators,
}: ValidateComponentsParams): ValidateComponentsResult => {
	const nodeDrafts = rootEditableDraft.queryAll(isComponentDraft);

	// queryAll's result isn't narrowed by its predicate
	const componentDrafts = nodeDrafts.filter(isComponentDraft);

	const validators = new Map(componentValidators.map(({ name, validate }) => [name, validate]));

	for (const componentDraft of componentDrafts) {
		const validate = validators.get(componentDraft.name);

		if (!validate) {
			return {
				sourceSnapshot: componentDraft,
				failedSnapshot: componentDraft,
				reason: `${formatNodePath({ rootDraft: componentDraft, nodeDraft: componentDraft })}: has no validator.`,
			};
		}

		const componentFailed = validate({ componentDraft });

		if (componentFailed) {
			return componentFailed;
		}
	}

	return null;
};
