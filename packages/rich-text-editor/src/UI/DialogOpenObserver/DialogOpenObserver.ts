const dialogOpenStyleSheet = new CSSStyleSheet();
dialogOpenStyleSheet.replaceSync(`
	html {
		overflow: hidden;
		scrollbar-gutter: stable;
	}
`);

export const createDialogOpenObserver = (shadowRoot: ShadowRoot) => {
	const setLocked = (locked: boolean) => {
		const isLocked = document.adoptedStyleSheets.includes(dialogOpenStyleSheet);
		if (locked === isLocked) {
			return;
		}

		document.adoptedStyleSheets = locked
			? [...document.adoptedStyleSheets, dialogOpenStyleSheet]
			: document.adoptedStyleSheets.filter(
					(sheet) => sheet !== dialogOpenStyleSheet,
				);
	};

	const observer = new MutationObserver(() => {
		const locked = shadowRoot.querySelector("dialog[open]") !== null;
		setLocked(locked);
	});

	observer.observe(shadowRoot, {
		subtree: true,
		attributes: true,
		attributeFilter: ["open"],
	});

	return () => {
		observer.disconnect();
		setLocked(false);
	};
};
