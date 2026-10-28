import type { EmptyMediaSettings } from "@rangex/editor/empty-media";
import type { EmptyMediaSlotSettings } from "#features";

export interface EmptyMediaExtensionSettings
	extends EmptyMediaSettings,
		EmptyMediaSlotSettings {}
