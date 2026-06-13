import type {
	CanWrapBlockComponentParams,
	CanWrapBlockComponentResult,
} from "./CanWrapBlockComponent-types";

export const canWrapBlockComponent = ({
	editorAPI,
	fromNode,
	fromOffset,
	toNode,
	toOffset,
	allowedComponents,
}: CanWrapBlockComponentParams): CanWrapBlockComponentResult => {
	const blockWrappableSegment = editorAPI.getBlockWrappableSegment({
		fromNode,
		fromOffset,
		toNode,
		toOffset,
	});

	if (!blockWrappableSegment) {
		return false;
	}

	const scopedEditable = blockWrappableSegment.getCommonScopedEditable();

	const { $$allowedComponents } = scopedEditable;

	if ($$allowedComponents === null) {
		return true;
	}

	const isAllowed = allowedComponents.every((componentName) =>
		$$allowedComponents.includes(componentName),
	);

	return isAllowed;
};
