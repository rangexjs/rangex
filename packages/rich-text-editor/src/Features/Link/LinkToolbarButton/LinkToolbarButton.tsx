import { Link, ReadOnly } from "@rangex/solid";
import { createMemo, createSignal, onCleanup, onSettled } from "solid-js";
import { useEditorContext } from "#context";
import { Icon } from "#ui";
import { ToolbarButton } from "../../_Utilities";

export const LinkToolbarButton = () => {
	const editor = useEditorContext();
	const { link, readOnly } = editor;

	if (!link) {
		throw new Error("Link can't be undefined.");
	}

	const $link = Link(link);
	const $readOnly = ReadOnly(readOnly);

	const [selectionMenuIsOpen, setSelectionMenuIsOpen] = createSignal(
		link.selectionMenu.isOpen,
	);

	const cleanupToggle = link.selectionMenu.onToggle(() => {
		setSelectionMenuIsOpen(link.selectionMenu.isOpen);
	});

	onCleanup(() => {
		cleanupToggle();
	});

	let containerRef: HTMLSpanElement;

	onSettled(() => {
		link.selectionMenu.addExemptNode(containerRef);

		return () => {
			link.selectionMenu.removeExemptNode(containerRef);
		};
	});

	const disabled = createMemo(
		() => !$link.canInsert() || !!$readOnly?.checked(),
	);

	const onClick = () => {
		if (link.selectionMenu.isOpen) {
			link.selectionMenu.close();
		} else {
			link.selectionMenu.open();
		}
	};

	return (
		<span ref={(el) => (containerRef = el)}>
			<ToolbarButton
				checked={selectionMenuIsOpen()}
				disabled={disabled()}
				onClick={onClick}
				aria-expanded={`${selectionMenuIsOpen()}`}
			>
				<Icon name="SimpleLink" title="Link" class="size-4" />
			</ToolbarButton>
		</span>
	);
};
