import type {
	AddHighlightParams,
	ClearParams,
	CodeBlockMap,
} from "./CSSHighlightManager-types";

export class CSSHighlightManager {
	#cssStyleSheet = new CSSStyleSheet();
	#codeBlockMap: CodeBlockMap = new WeakMap();

	get cssStyleSheet() {
		return this.#cssStyleSheet;
	}

	/**
	 * Add a range to a CSS highlight using a light/dark hex color pair.
	 * Skips non-hex colors. Creates a CSS highlight rule using light-dark()
	 * if one doesn't exist for the color pair, then registers the range
	 * in both the CSS Highlight API and the per-editable range map.
	 */
	addHighlight({ nestedEditable, theme, range }: AddHighlightParams) {
		const { light, dark } = theme;

		if (!(light.startsWith("#") && dark.startsWith("#"))) {
			return;
		}

		const entries = this.#codeBlockMap.getOrInsert(nestedEditable, []);

		const highlightName = `rangex-${light.slice(1)}-${dark.slice(1)}`;

		if (!CSS.highlights.has(highlightName)) {
			this.#cssStyleSheet.insertRule(
				`::highlight(${highlightName}) { color: light-dark(${light}, ${dark}); }`,
			);
		}

		// Use getOrInsert once it has full support
		const highlight = (() => {
			const currentHighlight = CSS.highlights.get(highlightName);

			if (currentHighlight) {
				return currentHighlight;
			}

			const newHighlight = new Highlight();

			CSS.highlights.set(highlightName, newHighlight);

			return newHighlight;
		})();

		highlight.add(range);

		entries.push({ highlight, range });
	}

	/**
	 * Remove all tracked ranges for a specific nestedEditable from every
	 * active CSS highlight, clearing its syntax highlighting without
	 * affecting other code blocks.
	 */
	clear({ nestedEditable }: ClearParams) {
		const entries = this.#codeBlockMap.get(nestedEditable);

		if (!entries) {
			return;
		}

		for (const { highlight, range } of entries) {
			highlight.delete(range);
		}

		this.#codeBlockMap.delete(nestedEditable);
	}
}
