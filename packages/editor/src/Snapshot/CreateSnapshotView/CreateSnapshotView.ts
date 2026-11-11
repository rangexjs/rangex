import {
	type CreateSnapshotViewParams,
	type CreateSnapshotViewResult,
	createSnapshotView as createEngineSnapshotView,
} from "@rangex/core";
import { ensureSanitizerConfigured } from "#sanitizer";

/*
 * Creates the engine's SnapshotView, validated by the SanitizerPolicies set by configureSanitizer (the basePolicy alone
 * if it hasn't been called).
 */
export const createSnapshotView = (
	params: CreateSnapshotViewParams,
): CreateSnapshotViewResult => {
	ensureSanitizerConfigured();

	return createEngineSnapshotView(params);
};
