import { buildViewStyleText, createSnapshotView } from "@rangex/editor";
import { getViewStyles } from "../../EngineStyles";
import type {
	CreateRichTextSnapshotViewParams,
	CreateRichTextSnapshotViewResult,
} from "./CreateRichTextSnapshotView-types";

export const createRichTextSnapshotView = ({
	storedSnapshot,
}: CreateRichTextSnapshotViewParams): CreateRichTextSnapshotViewResult => {
	const { snapshotView } = createSnapshotView({ storedSnapshot });

	const styles = getViewStyles();
	const viewStyleText = buildViewStyleText(styles);

	return {
		snapshotView: {
			...snapshotView,
			styles: snapshotView.styles + viewStyleText,
		},
	};
};
