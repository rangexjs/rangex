import { assertNever } from "#utilities";

import { getClosestScopedEditable } from "../../NodeQuery";
import type {
	CanInsertBlockLinesParams,
	CanInsertBlockLinesResult,
} from "./CanInsertBlockLines-types";

/**
 * Returns true if a block-level component can be inserted at the given node's position, checked against the
 * ScopedEditable the `scope` resolves to.
 */
export const canInsertBlockLines = ({
	fromNode,
	scope,
	allowedComponents,
}: CanInsertBlockLinesParams): CanInsertBlockLinesResult => {
	const scopedEditable = (() => {
		if (scope === "current") {
			const scopedEditable = getClosestScopedEditable({ fromNode });

			if (scopedEditable?.$$display !== "block multi-line") {
				return null;
			}

			return scopedEditable;
		}

		if (scope === "nearest-multi-line") {
			const scopedEditable = getClosestScopedEditable({
				fromNode,
				display: "block multi-line",
			});

			return scopedEditable;
		}

		return assertNever(scope);
	})();

	if (!scopedEditable) {
		return false;
	}

	const { $$allowedComponents } = scopedEditable;

	if ($$allowedComponents === null) {
		return true;
	}

	const isAllowed = allowedComponents.every((componentName) =>
		$$allowedComponents.includes(componentName),
	);

	return isAllowed;
};
