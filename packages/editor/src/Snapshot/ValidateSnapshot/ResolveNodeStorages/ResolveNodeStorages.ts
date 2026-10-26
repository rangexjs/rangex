import { isComponentDraft } from "@rangex/core";
import type { ResolveNodeStoragesParams } from "./ResolveNodeStorages-types";

/*
 * Drops the customStorage of every node the editor never stores anything on: every node in the RootEditable except the
 * components, whose storage their validators check. Nothing reads these values, so they're set to null instead of
 * making the snapshot invalid. The RootEditable's own storage isn't touched.
 */
export const resolveNodeStorages = ({
	rootEditableDraft,
}: ResolveNodeStoragesParams) => {
	const nodeDrafts = rootEditableDraft.queryAll(
		(nodeDraft) => !isComponentDraft(nodeDraft),
	);

	for (const nodeDraft of nodeDrafts) {
		nodeDraft.customStorage = null;
	}
};
