import { FloatingPortal } from "@rangex/solid";
import { createSignal, flush, onCleanup } from "solid-js";
import { useEditorContext } from "#context";
import { createTextFieldState } from "#ui";
import { allowedPrefixes, LinkEdit, LinkPreview } from "../_Utilities";

type MenuView = "preview" | "edit";

export const LinkMenu = () => {
	const { link } = useEditorContext();

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

	const [view, setView] = createSignal<MenuView>("preview");

	const [displayTextHandle, displayTextControls] =
		createTextFieldState<HTMLInputElement>({});
	const [displayTextDisabled, setDisplayTextDisabled] = createSignal(false);

	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [isNewTab, setIsNewTab] = createSignal(false);

	const { linkMenuEl } = link;

	const getAnchor = () => {
		const { currentComponent } = link;

		if (!currentComponent) {
			throw new Error("CurrentComponent not supposed to be null.");
		}

		const anchor = currentComponent.querySelector("a");

		if (!anchor) {
			throw new Error("Anchor wasn't found.");
		}

		return anchor;
	};

	const syncFields = () => {
		const anchor = getAnchor();

		const { value, disabled } = link.getDisplayText();

		displayTextHandle.reset();
		displayTextHandle.setValue(value);
		setDisplayTextDisabled(disabled);

		urlHandle.reset();
		urlHandle.setValue(anchor.href);

		setIsNewTab(anchor.target === "_blank");

		flush();

		const input = linkMenuEl.querySelector<HTMLInputElement>(
			`#${displayTextHandle.id}`,
		);

		if (!input) {
			throw new Error("Input wasn't found.");
		}

		input.focus();
	};

	const linkMenuToggleCleanup = link.onLinkMenuToggle(() => {
		if (!link.linkMenuOpen) {
			return;
		}

		setView("preview");
		flush();
		syncFields();
	});

	onCleanup(() => {
		linkMenuToggleCleanup();
	});

	const onEdit = () => {
		setView("edit");
	};

	const onCopy = () => {
		const anchor = getAnchor();

		const { href } = anchor;

		navigator.clipboard.writeText(href);
	};

	const onUnwrap = () => {
		link.unwrap();
	};

	const onNewTabChange = () => {
		setIsNewTab((prev) => !prev);
	};

	const onModify = () => {
		urlHandle.validate();

		flush();

		if (urlHandle.state().hasError) {
			return;
		}

		const rawUrl = urlHandle.value();
		const normalizedUrl = allowedPrefixes.some((prefix) =>
			rawUrl.startsWith(prefix),
		)
			? rawUrl
			: `https://${rawUrl}`;

		const text = displayTextHandle.value() || normalizedUrl;

		link.modify({ text });

		const anchor = getAnchor();

		if (!anchor) {
			throw new Error("Anchor wasn't found.");
		}

		anchor.href = normalizedUrl;
		anchor.target = isNewTab() ? "_blank" : "_self";

		setView("preview");
	};

	const onCancel = () => {
		setView("preview");
		syncFields();
	};

	return (
		<FloatingPortal
			mount={linkMenuEl}
			class="z-20 w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<span class="absolute -top-1.5 left-1/2 inline-block size-3 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-900" />
			<LinkPreview
				url={urlHandle.value()}
				onEdit={onEdit}
				onCopy={onCopy}
				onUnwrap={onUnwrap}
				class={{ hidden: view() !== "preview" }}
			/>
			<LinkEdit
				mode="modify"
				displayTextHandle={displayTextHandle}
				displayTextControls={displayTextControls}
				displayTextDisabled={displayTextDisabled()}
				urlHandle={urlHandle}
				urlControls={urlControls}
				onNewTabChange={onNewTabChange}
				isNewTab={isNewTab()}
				onApply={onModify}
				onCancel={onCancel}
				class={{ hidden: view() !== "edit" }}
			/>
		</FloatingPortal>
	);
};
