import { listRole, listRoleSelector } from "@rangex/core";
import { handleSelectionContextChange } from "../../_Utilities";
import type {
	GetComponentListParams,
	HandleListStateParams,
} from "./HandleListState-types";

/*
 * Returns the list component's own List; nested lists sit in their own components after it.
 */
const getComponentList = ({ blockComponent }: GetComponentListParams) => {
	const list = blockComponent.$$querySelector(listRoleSelector);

	if (list?.$$editorRole !== listRole) {
		throw new Error("List's type is invalid.");
	}

	return list;
};

/*
 * Keeps the port's localName in sync with the current list and wires localName changes to it,
 * converting the list in place and registering a snapshot boundary. Returns a cleanup function.
 */
export const handleListState = ({
	configPort,
	editorAPI,
}: HandleListStateParams) => {
	// The List is replaced on conversion while its component stays, so structural changes must re-sync too.
	const selectionContextCleanup = handleSelectionContextChange({
		editorAPI,
		onChange: () => {
			const { currentComponent } = configPort;

			if (!currentComponent) {
				configPort.updateState({ localName: null });
				return;
			}

			const list = getComponentList({ blockComponent: currentComponent });

			configPort.updateState({ localName: list.$$localName });
		},
	});

	const unsubscribeLocalNameChange = configPort.onChangeLocalName(
		(localName) => {
			const { currentComponent } = configPort;

			if (!currentComponent) {
				console.warn("handleListState: no list is currently active.");
				return;
			}

			const list = getComponentList({ blockComponent: currentComponent });

			if (list.$$localName === localName) {
				return;
			}

			list.$$changeLocalName({ toLocalName: localName });

			const snapshotTimeline = editorAPI.getSnapshotTimeline();

			snapshotTimeline.registerSnapshotBoundary();

			editorAPI.focus();
		},
	);

	return () => {
		selectionContextCleanup();
		unsubscribeLocalNameChange();
	};
};
