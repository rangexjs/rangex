import type { CaptionPosition } from "@rangex/editor";
import type { AudioAttrsPatch } from "@rangex/editor/audio";
import { Audio, FloatingPortal, ReadOnly } from "@rangex/solid";
import { createEffect, createSignal, createUniqueId, onCleanup } from "solid-js";

import { useEditorContext } from "#context";
import {
  createTextFieldController,
  Icon,
  InputTextField,
  SegmentedControl,
  type SegmentedControlControls,
  TextFieldWrapper,
  ToggleButton,
} from "#ui";

import { BlockAlign, SourceUrl } from "../../_Utilities";

const captionPositionControls: SegmentedControlControls<CaptionPosition> = [
  { id: "above", node: "Above" },
  { id: "below", node: "Below" },
];

export const AudioQuickActions = () => {
  const editor = useEditorContext();
  const { audio, readOnly } = editor;

  if (!audio) {
    throw new Error("Audio can't be undefined.");
  }

  const $audio = Audio(audio);
  const $readOnly = ReadOnly(readOnly);

  const audioAttrs = () => $audio.domAttrs()?.audio ?? null;

  const hasAudioAttr = (attrName: "autoplay" | "loop" | "muted") => {
    const value = audioAttrs()?.[attrName] ?? null;

    return value !== null;
  };

  const autoplay = () => hasAudioAttr("autoplay");
  const loop = () => hasAudioAttr("loop");
  const muted = () => hasAudioAttr("muted");

  const [titleHandle, titleControls] = createTextFieldController<HTMLInputElement>({
    defaultValue: "",
  });

  const [committedTitle, setCommittedTitle] = createSignal("");

  const isTitleDirty = () => titleHandle.value() !== committedTitle();

  createEffect(
    () => audioAttrs()?.title ?? "",
    (title) => {
      titleHandle.setValue(title);
      setCommittedTitle(title);
    },
  );

  const changeAudioAttrs = (audioAttrsPatch: AudioAttrsPatch["audio"]) => {
    if (!audio.domAttrs) {
      return;
    }

    const changeFailed = audio.changeDOMAttrs({ audio: audioAttrsPatch });

    if (changeFailed) {
      console.warn("Audio's attributes were rejected.", changeFailed);
    }
  };

  const onAutoplayToggle = () => {
    if (autoplay()) {
      changeAudioAttrs({ autoplay: null });
      return;
    }

    changeAudioAttrs({ autoplay: "", muted: "" });
  };

  const onLoopToggle = () => {
    changeAudioAttrs({ loop: loop() ? null : "" });
  };

  const onMutedToggle = () => {
    if (autoplay()) {
      return;
    }

    changeAudioAttrs({ muted: muted() ? null : "" });
  };

  const onTitleCommit = () => {
    if (!isTitleDirty()) {
      return;
    }

    changeAudioAttrs({ title: titleHandle.value() });
  };

  const onTitleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return;
    }

    onTitleCommit();
  };

  const onSwapClick = () => {
    audio.swap();
  };

  const onCaptionToggle = () => {
    audio.changeCaptionEnabled(!$audio.captionEnabled());
  };

  let blockAlignPopover: HTMLDivElement | undefined;
  let optionsPopover: HTMLDivElement | undefined;
  let sourceUrlPopover: HTMLDivElement | undefined;

  const optionsPopoverId = createUniqueId();

  const closeNestedPopovers = () => {
    const nestedPopovers = [blockAlignPopover, sourceUrlPopover, optionsPopover];

    for (const nestedPopover of nestedPopovers) {
      if (!nestedPopover) {
        throw new Error("Nested popover shouldn't be undefined.");
      }

      if (nestedPopover.matches(":popover-open")) {
        // Force a synchronous reflow before hiding — otherwise the popover can
        // briefly animate from a stale, not-yet-committed style.
        // oxlint-disable-next-line no-unused-expressions -- Reading offsetHeight forces a synchronous reflow
        nestedPopover.offsetHeight;
        nestedPopover.hidePopover();
      }
    }
  };

  const unsubscribeIsOpen = audio.quickActions.onToggle(() => {
    if (!audio.quickActions.isOpen) {
      closeNestedPopovers();
    }
  });

  onCleanup(() => {
    unsubscribeIsOpen();
  });

  return (
    <FloatingPortal mount={audio.quickActions.element}>
      <div class="z-20 flex items-center gap-1 rounded-md border border-neutral-200 bg-white p-0.5 shadow-xs dark:border-neutral-700 dark:bg-neutral-900">
        <BlockAlign
          value={$audio.align()}
          disabled={$readOnly?.isEnabled()}
          onChange={(value) => audio.changeAlign(value)}
          popoverRef={(el) => {
            blockAlignPopover = el;
          }}
        />

        <button
          type="button"
          class="btn-menu-trigger flex items-center justify-center rounded p-1"
          aria-label="Swap audio"
          disabled={!audio.canSwap || $readOnly?.isEnabled()}
          onClick={onSwapClick}
        >
          <Icon name="Swap" class="size-4" />
        </button>

        <SourceUrl
          src={$audio.domAttrs()?.audio.src ?? null}
          label="Audio source"
          popoverRef={(el) => {
            sourceUrlPopover = el;
          }}
        />

        <span>
          <button
            type="button"
            commandfor={optionsPopoverId}
            command="toggle-popover"
            class="btn-menu-trigger flex items-center justify-center rounded p-1"
            aria-label="Audio options"
            disabled={$readOnly?.isEnabled()}
          >
            <Icon name="DotsThreeHorizontal" class="size-4" />
          </button>

          <div
            ref={(el) => {
              optionsPopover = el;
            }}
            id={optionsPopoverId}
            popover="auto"
            class="w-52 space-y-2 rounded-lg border border-neutral-200 bg-white p-2 shadow-sm [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                Autoplay
              </span>
              <ToggleButton checked={autoplay()} label="Autoplay" onClick={onAutoplayToggle} />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-neutral-600 dark:text-neutral-300">Loop</span>
              <ToggleButton checked={loop()} label="Loop" onClick={onLoopToggle} />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-neutral-600 dark:text-neutral-300">Muted</span>
              <ToggleButton checked={muted()} label="Muted" onClick={onMutedToggle} />
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                Caption
              </span>
              <ToggleButton
                checked={$audio.captionEnabled()}
                label="Caption"
                onClick={onCaptionToggle}
              />
            </div>

            <div hidden={!$audio.captionEnabled()}>
              <SegmentedControl
                id={$audio.captionPosition()}
                controls={captionPositionControls}
                label="Caption position"
                onChange={(value) => audio.changeCaptionPosition(value)}
                appearance="primary-outline"
                class="rounded-sm"
                commonButtonClass="rounded-sm py-1 font-medium text-xs"
              />
            </div>

            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <label
                  for={titleHandle.id}
                  class="text-xs font-medium text-neutral-600 dark:text-neutral-300"
                >
                  Title
                </label>
                <span
                  class="text-xs text-neutral-500 dark:text-neutral-400"
                  hidden={!isTitleDirty()}
                >
                  Enter to save
                </span>
              </div>
              <TextFieldWrapper appearance="neutral-filled-underline" size="small">
                <InputTextField
                  type="text"
                  placeholder="Describe the audio"
                  spellcheck={false}
                  {...titleControls}
                  onBlur={onTitleCommit}
                  onKeyDown={onTitleKeyDown}
                />
              </TextFieldWrapper>
            </div>
          </div>
        </span>
      </div>
    </FloatingPortal>
  );
};
