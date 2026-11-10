import type { SourcePlaceholderSettings } from "@rangex/editor/source-placeholder";
import type { SourcePlaceholderSlotSettings } from "#features";

export interface SourcePlaceholderExtensionSettings
	extends SourcePlaceholderSettings,
		SourcePlaceholderSlotSettings {}
