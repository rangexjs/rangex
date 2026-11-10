import { createMemo, createSignal, flush } from "solid-js";
import {
	createTextFieldState,
	FormField,
	Icon,
	InputTextField,
	SegmentedControl,
	TextFieldWrapper,
} from "#ui";
import { detectMediaFileType } from "../../_Utilities";
import { getMediaTabControls } from "./GetMediaTabControls";
import type {
	MediaSourcePickerProps,
	MediaTab,
} from "./MediaSourcePicker-types";

/*
 * A SegmentedControl between an Upload tab (file picker) and a Link tab, whose media type is detected once it's
 * submitted. The SegmentedControl is hidden if there's only the Link tab. Stays mounted while it's hidden, so the picked
 * source survives a failed attempt.
 */
export const MediaSourcePicker = (props: MediaSourcePickerProps) => {
	const mediaTabControls = getMediaTabControls(props.supportedMediaTypes);

	const fileAccept = props.supportedMediaTypes
		.filter((type) => type !== "embed")
		.map((type) => `${type}/*`)
		.join(",");

	const [activeTab, setActiveTab] = createSignal<MediaTab>(
		mediaTabControls[0].id,
	);

	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
	const selectedFileName = createMemo(() => selectedFile()?.name ?? null);

	let fileInput: HTMLInputElement | undefined;

	const onTabChange = (tab: MediaTab) => {
		setActiveTab(tab);
		urlHandle.reset();
	};

	const onFileChange = (event: Event) => {
		const { currentTarget } = event;

		if (!(currentTarget instanceof HTMLInputElement)) {
			throw new Error("CurrentTarget must be an HTMLInputElement.");
		}

		const [file] = currentTarget.files ?? [];
		currentTarget.value = "";

		if (!file) {
			return;
		}

		const type = detectMediaFileType({
			file,
			supportedMediaTypes: props.supportedMediaTypes,
		});

		if (!type) {
			return;
		}

		setSelectedFile(file);
	};

	const onApply = () => {
		const tab = activeTab();

		if (tab === "upload") {
			const file = selectedFile();

			if (!file) {
				return;
			}

			const type = detectMediaFileType({
				file,
				supportedMediaTypes: props.supportedMediaTypes,
			});

			if (!type) {
				return;
			}

			props.onSubmitFile(type, file);
			return;
		}

		urlHandle.validate();

		flush();

		if (urlHandle.state().hasError) {
			return;
		}

		props.onSubmitUrl(urlHandle.value());
	};

	const onUrlKeyDown = (event: KeyboardEvent) => {
		if (event.key !== "Enter") {
			return;
		}

		onApply();
	};

	return (
		<div
			class={[
				"mx-auto w-full max-w-125 flex-col gap-3",
				{ flex: props.visible, hidden: !props.visible },
			]}
		>
			<div class="flex flex-col items-center gap-1 text-neutral-500 text-sm dark:text-neutral-400">
				<Icon name="FileArrowUp" class="size-6" />
				<span>Drag and drop, or choose a source below</span>
			</div>

			<div
				role="alert"
				class={[
					"rounded-sm bg-red-50 px-3 py-2 text-red-600 text-sm dark:bg-red-950 dark:text-red-400",
					{ hidden: props.errorMessage === null },
				]}
			>
				{props.errorMessage}
			</div>

			<SegmentedControl
				id={activeTab()}
				controls={mediaTabControls}
				onChange={onTabChange}
				label="Media source"
				appearance="primary-outline"
				class={[
					"rounded-sm border-solid",
					{ hidden: mediaTabControls.length < 2 },
				]}
				commonButtonClass="inline-flex items-center justify-center py-1.5 font-medium text-xs"
			/>

			<div class={{ hidden: activeTab() !== "upload" }}>
				<button
					type="button"
					class="btn-neutral-solid w-full rounded-sm px-3 py-2 text-left font-medium text-sm"
					onClick={() => fileInput?.click()}
				>
					{selectedFileName() ?? "Choose file…"}
				</button>
				<input
					ref={fileInput}
					type="file"
					accept={fileAccept}
					class="hidden"
					onChange={onFileChange}
				/>
			</div>

			<FormField
				for={urlHandle.id}
				class={{ hidden: activeTab() !== "link" }}
				state={urlHandle.state()}
			>
				<TextFieldWrapper appearance="primary-outline" size="medium">
					<InputTextField
						type="text"
						aria-label="Link"
						placeholder="Paste a link…"
						spellcheck={false}
						{...urlControls}
						onKeyDown={onUrlKeyDown}
					/>
				</TextFieldWrapper>
			</FormField>

			<div class="text-right">
				<button
					type="button"
					class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
					onClick={onApply}
				>
					Apply
				</button>
			</div>
		</div>
	);
};
