import { FloatingPortal, Link } from "@rangex/solid";
import { createEffect, createSignal, flush, onCleanup } from "solid-js";
import { useEditorContext } from "#context";
import { createTextFieldState } from "#ui";
import { getDisplayTextField, LinkEdit, LinkPreview } from "../_Utilities";

type MenuView = "preview" | "edit";

export const LinkMenu = () => {
	const editor = useEditorContext();
	const { link } = editor;

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

	const $link = Link(link);

	const [view, setView] = createSignal<MenuView>("preview");

	const [displayTextHandle, displayTextControls] =
		createTextFieldState<HTMLInputElement>({});
	const [displayTextDisabled, setDisplayTextDisabled] = createSignal(false);
	const [displayTextPlaceholder, setDisplayTextPlaceholder] = createSignal("");

	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		error: {
			required: { value: true, message: "Field can't be empty." },
			custom: {
				isValid: (value) => {
					const mismatch = link.validateDOMAttrs({
						anchor: {
							href: value,
						},
					});

					return !mismatch;
				},
				message: "URL isn't allowed.",
			},
		},
	});

	const [isNewTab, setIsNewTab] = createSignal(false);

	const [isOpen, setIsOpen] = createSignal(false);

	const { linkMenuEl } = link;

	const getDOMAttrs = () => {
		const { domAttrs } = link;

		if (!domAttrs) {
			throw new Error("DOMAttrs not supposed to be null.");
		}

		return domAttrs;
	};

	const focusDisplayTextInput = () => {
		const input = linkMenuEl.querySelector<HTMLInputElement>(
			`#${displayTextHandle.id}`,
		);

		if (!input) {
			throw new Error("Input wasn't found.");
		}

		input.focus();
	};

	createEffect(
		() => ({ domAttrs: $link.domAttrs(), view: view(), isOpen: isOpen() }),
		({ domAttrs, view, isOpen }) => {
			if (!isOpen || view !== "preview" || !domAttrs) {
				return;
			}

			const { anchor } = domAttrs;

			const { value, disabled, placeholder } = getDisplayTextField(
				link.getDisplayText(),
			);

			displayTextHandle.reset();
			displayTextHandle.setValue(value);
			setDisplayTextDisabled(disabled);
			setDisplayTextPlaceholder(placeholder);

			urlHandle.reset();
			urlHandle.setValue(anchor.href);

			setIsNewTab(anchor.target === "_blank");
		},
	);

	const linkMenuToggleCleanup = link.onLinkMenuToggle(() => {
		setIsOpen(link.linkMenuOpen);

		if (!link.linkMenuOpen) {
			return;
		}

		setView("preview");
	});

	onCleanup(() => {
		linkMenuToggleCleanup();
	});

	const onEdit = () => {
		setView("edit");
		flush();
		focusDisplayTextInput();
	};

	const onCopy = () => {
		const { href } = getDOMAttrs().anchor;

		navigator.clipboard.writeText(href);
	};

	const onUnwrap = () => {
		link.unwrap();
	};

	const onNewTabChange = () => {
		setIsNewTab((prev) => !prev);
	};

	const onChangeDisplayText = () => {
		urlHandle.validate();

		flush();

		if (urlHandle.state().hasError) {
			return;
		}

		// The attributes first, so the text stays unchanged if they're rejected
		const changeFailed = link.changeDOMAttrs({
			anchor: {
				href: urlHandle.value(),
				target: isNewTab() ? "_blank" : null,
			},
		});

		if (changeFailed) {
			console.warn("Link's attributes were rejected.", changeFailed);
			return;
		}

		// The href as it was written (normalized)
		const { href } = getDOMAttrs().anchor;

		const displayText = displayTextHandle.value() || href;

		link.changeDisplayText({ displayText });

		setView("preview");
	};

	const onCancel = () => {
		setView("preview");
	};

	return (
		<FloatingPortal
			mount={linkMenuEl}
			class="z-20 w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<span class="absolute -top-1.5 left-1/2 inline-block size-3 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-900" />
			<LinkPreview
				url={$link.domAttrs()?.anchor.href ?? ""}
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
				displayTextPlaceholder={displayTextPlaceholder()}
				urlHandle={urlHandle}
				urlControls={urlControls}
				onNewTabChange={onNewTabChange}
				isNewTab={isNewTab()}
				onApply={onChangeDisplayText}
				onCancel={onCancel}
				class={{ hidden: view() !== "edit" }}
			/>
		</FloatingPortal>
	);
};
