import { assertNever } from "#utilities";
import { getClosestCommonScopedEditable } from "../../NodeQuery";
import type {
	CanWrapBlockComponentParams,
	CanWrapBlockComponentResult,
} from "./CanWrapBlockComponent-types";

/*
 * Whether the lines of the given range can be wrapped into the allowed components. With `"current"` scope, the
 * innermost ScopedEditable holding both ends must itself be `"block multi-line"`, so it never wraps an outer line.
 */
export const canWrapBlockComponent = ({
	editorAPI,
	fromNode,
	fromOffset,
	toNode,
	toOffset,
	scope,
	allowedComponents,
}: CanWrapBlockComponentParams): CanWrapBlockComponentResult => {
	const scopedEditable = (() => {
		if (scope === "current") {
			const scopedEditable = getClosestCommonScopedEditable({
				fromNode,
				toNode,
			});

			if (scopedEditable?.$$display !== "block multi-line") {
				return null;
			}

			return scopedEditable;
		}

		if (scope === "nearest-multi-line") {
			const blockWrappableSegment = editorAPI.getBlockWrappableSegment({
				fromNode,
				fromOffset,
				toNode,
				toOffset,
			});

			if (!blockWrappableSegment) {
				return null;
			}

			const scopedEditable = blockWrappableSegment.getCommonScopedEditable();

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
