import { FloatingPortal } from "@rangex/solid";
import { createSignal, flush, onCleanup } from "solid-js";
import { useEditorContext } from "#context";
import { createTextFieldState } from "#ui";
import { getDisplayTextField, LinkEdit } from "../_Utilities";

export const LinkSelectionMenu = () => {
	const editor = useEditorContext();
	const { link } = editor;

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

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

	const selectionMenuEl = link.selectionMenu.element;

	const refreshFields = () => {
		displayTextHandle.reset();
		const { value, disabled, placeholder } = getDisplayTextField(
			link.getDisplayText(),
		);
		displayTextHandle.setValue(value);
		setDisplayTextDisabled(disabled);
		setDisplayTextPlaceholder(placeholder);

		urlHandle.reset();
		setIsNewTab(false);

		flush();

		const input = selectionMenuEl.querySelector<HTMLInputElement>(
			`#${displayTextHandle.id}`,
		);

		if (!input) {
			throw new Error("Input wasn't found.");
		}

		input.focus();
	};

	const selectionMenuOpenUpdateCleanup = link.selectionMenu.onToggle(() => {
		if (!link.selectionMenu.isOpen) {
			return;
		}

		refreshFields();
	});

	onCleanup(() => {
		selectionMenuOpenUpdateCleanup();
	});

	const onInsert = () => {
		urlHandle.validate();

		flush();

		if (urlHandle.state().hasError) {
			return;
		}

		const url = urlHandle.value();

		link.insert({
			text: displayTextHandle.value(),
			attrs: {
				anchor: {
					href: url,
					target: isNewTab() ? "_blank" : null,
				},
			},
		});

		link.selectionMenu.close();
	};

	const onNewTabChange = () => {
		setIsNewTab((prev) => !prev);
	};

	const onCancel = () => {
		link.selectionMenu.close();
	};

	return (
		<FloatingPortal
			mount={selectionMenuEl}
			class="z-20 w-64 overflow-visible rounded-lg border border-neutral-300 bg-white p-2 shadow-md dark:border-neutral-700 dark:bg-neutral-900"
		>
			<span class="absolute -top-2 left-1/2 inline-block size-4 -translate-x-1/2 rotate-45 border-neutral-300 border-t border-l bg-white dark:border-neutral-700 dark:bg-neutral-900" />
			<LinkEdit
				mode="insert"
				displayTextHandle={displayTextHandle}
				displayTextControls={displayTextControls}
				displayTextDisabled={displayTextDisabled()}
				displayTextPlaceholder={displayTextPlaceholder()}
				urlHandle={urlHandle}
				urlControls={urlControls}
				onNewTabChange={onNewTabChange}
				isNewTab={isNewTab()}
				onApply={onInsert}
				onCancel={onCancel}
			/>
		</FloatingPortal>
	);
};
