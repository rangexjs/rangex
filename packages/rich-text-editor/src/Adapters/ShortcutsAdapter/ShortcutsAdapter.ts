import { adapterIds } from "#ports";
import type {
	ShortcutsAdapterConstructorParams,
	ShortcutsEditorPort,
	ShortcutsUIPort,
} from "./ShortcutsAdapter-types";

export class ShortcutsAdapter {
	constructor(...params: ShortcutsAdapterConstructorParams) {
		const [_settings, _options] = params;
	}

	get id() {
		return adapterIds.shortcuts;
	}

	get uiPort(): ShortcutsUIPort {
		return {};
	}

	get editorPort(): ShortcutsEditorPort {
		return {};
	}
}
