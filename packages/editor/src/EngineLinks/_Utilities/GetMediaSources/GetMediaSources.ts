import { htmlLayoutRole, snapshotManager } from "@rangex/core";

import type { GetMediaSourcesParams, GetMediaSourcesResult } from "./GetMediaSources-types";

const mediaLocalNames = ["audio", "img", "video"];

export const getMediaSources = ({
	rootEditableSnapshot,
}: GetMediaSourcesParams): GetMediaSourcesResult => {
	const rootEditableDraft = snapshotManager.createDraftFromSnapshot(rootEditableSnapshot);

	const mediaElements = rootEditableDraft.queryAll((node) => {
		if (node.editorRole !== htmlLayoutRole) {
			return false;
		}

		const { localName } = node;

		if (!mediaLocalNames.includes(localName)) {
			return false;
		}

		return true;
	});

	const sources: string[] = [];

	for (const mediaElement of mediaElements) {
		if (mediaElement.editorRole !== htmlLayoutRole) {
			throw new Error("MediaElement's editorRole is invalid.");
		}

		const { src } = mediaElement.domAttrs;

		if (!src) {
			console.warn("src attribute is missing.");
			continue;
		}

		sources.push(src);
	}

	return sources;
};
