import { buildViewStyleText, createSnapshotView } from "@rangex/editor";
import { getViewStyles } from "../../EngineStyles";
import type {
	CreateRichTextSnapshotViewParams,
	CreateRichTextSnapshotViewResult,
} from "./CreateRichTextSnapshotView-types";

export const createRichTextSnapshotView = ({
	storedSnapshot,
	limits,
}: CreateRichTextSnapshotViewParams): CreateRichTextSnapshotViewResult => {
	const { snapshotView } = createSnapshotView({ storedSnapshot, limits });

	const styles = getViewStyles();
	const viewStyleText = buildViewStyleText(styles);

	return {
		snapshotView: {
			...snapshotView,
			styles: snapshotView.styles + viewStyleText,
		},
	};
};
