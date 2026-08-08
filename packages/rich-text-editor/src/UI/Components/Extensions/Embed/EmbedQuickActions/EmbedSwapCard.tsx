import { createSignal, onCleanup, onMount } from "solid-js";
import type { EmbedUIPort } from "#adapters";
import {
	createTextFieldState,
	FormField,
	InputTextField,
	TextFieldWrapper,
} from "../../../InputFields";

export interface EmbedSwapCardProps {
	uiPort: EmbedUIPort;
}

export const EmbedSwapCard = (props: EmbedSwapCardProps) => {
	const [urlHandle, urlControls] = createTextFieldState<HTMLInputElement>({
		error: { required: { value: true, message: "Field can't be empty." } },
	});

	const [checkState, setCheckState] = createSignal(props.uiPort.swapCheckState);

	const checkErrorMessage = () => {
		const state = checkState();
		return state.status === "error" ? state.message : "";
	};

	onMount(() => {
		const unsubscribe = props.uiPort.onSwapCheckStateUpdate(setCheckState);

		onCleanup(() => {
			unsubscribe();
		});
	});

	onMount(() => {
		const unsubscribe = props.uiPort.onIsSwapCardOpenUpdate((value) => {
			if (value) {
				return;
			}

			urlHandle.reset();
			setCheckState({ status: "idle" });
		});

		onCleanup(() => {
			unsubscribe();
		});
	});

	const onUpdateClick = (event: MouseEvent) => {
		event.preventDefault();

		urlHandle.validate();

		if (urlHandle.state().hasError) {
			return;
		}

		props.uiPort.emitSwap({ url: urlHandle.value() });
	};

	let updateButtonRef: HTMLButtonElement | undefined;

	const onKeyDown = (event: KeyboardEvent) => {
		if (!updateButtonRef) {
			throw new Error("UpdateButtonRef can't be undefined.");
		}

		if (event.key !== "Enter") {
			return;
		}

		updateButtonRef.click();
	};

	return (
		<div
			ref={(el) => props.uiPort.swapCardOverlay.setElement(el)}
			class="z-20 w-64 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
		>
			<div class="mb-3">
				<FormField for={urlHandle.id} state={urlHandle.state()}>
					<TextFieldWrapper appearance="primary-outline" size="medium">
						<InputTextField
							type="text"
							aria-label="URL"
							placeholder="https://example.com/embed"
							spellcheck={false}
							{...urlControls}
							on:keydown={onKeyDown}
						/>
					</TextFieldWrapper>
				</FormField>
			</div>

			<div
				class="mb-3 text-red-600 text-sm dark:text-red-400"
				hidden={checkState().status !== "error"}
			>
				{checkErrorMessage()}
			</div>

			<div class="flex justify-end gap-2">
				<button
					type="button"
					class="btn-neutral-solid rounded-sm px-4 py-1 font-semibold text-sm"
					on:click={() => props.uiPort.emitToggleSwap()}
				>
					Cancel
				</button>
				<button
					ref={updateButtonRef}
					type="button"
					class="btn-primary-solid rounded-sm px-4 py-1 font-semibold text-sm"
					on:click={onUpdateClick}
				>
					Update
				</button>
			</div>
		</div>
	);
};
