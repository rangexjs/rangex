import { adapterIds } from "#ports";
import type {
	MarkdownAdapterConstructorParams,
	MarkdownEditorPort,
	MarkdownUIPort,
} from "./MarkdownAdapter-types";

export class MarkdownAdapter {
	constructor(...params: MarkdownAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.markdown;
	}

	get uiPort(): MarkdownUIPort {
		return {};
	}

	get editorPort(): MarkdownEditorPort {
		return {};
	}
}
