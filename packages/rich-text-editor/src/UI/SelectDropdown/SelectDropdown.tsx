import type { JSX } from "@solidjs/web";
import { createUniqueId, For } from "solid-js";

import { Icon } from "../Icon";

export interface SelectDropdownOption<Option> {
  label: string;
  value: Option;
}

export interface SelectDropdownProps<Option> {
  value: NoInfer<Option>;
  options: SelectDropdownOption<Option>[];
  notFoundLabel?: JSX.Element;
  onSelect: (value: NoInfer<Option>) => void;
  disabled?: boolean;
}

export const SelectDropdown = <Option,>(props: SelectDropdownProps<Option>) => {
  const popoverId = createUniqueId();

  const selectedLabel = () => {
    const selectedOption = props.options.find((option) => option.value === props.value);

    if (!selectedOption) {
      return props.notFoundLabel;
    }

    return selectedOption.label;
  };

  return (
    <div class="contents">
      <button
        type="button"
        commandfor={popoverId}
        command="toggle-popover"
        class={[
          "flex w-full items-center justify-between gap-2 rounded-md border border-neutral-200 px-2 py-1 text-xs font-medium text-neutral-800 transition-colors hover:bg-neutral-50 active:border-neutral-300 active:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:active:border-neutral-500 dark:active:bg-neutral-800",
          "[&:has(~:popover-open)]:rounded-b-none [&:has(~:popover-open)]:border-b-neutral-200 [&:has(~:popover-open)]:dark:border-b-neutral-700",
        ]}
        disabled={props.disabled}
      >
        <span class="truncate">{selectedLabel()}</span>
        <Icon name="CaretDown" class="size-2 shrink-0 text-neutral-400 dark:text-neutral-500" />
      </button>
      <div
        id={popoverId}
        popover="auto"
        class="max-h-48 w-[anchor-size(width)] scrollbar-thin overflow-y-auto rounded-b-md border-r border-b border-l border-neutral-200 bg-white shadow-lg [position-area:center_bottom] dark:border-neutral-700 dark:bg-neutral-800"
      >
        <For each={props.options}>
          {(option) => (
            <button
              type="button"
              commandfor={popoverId}
              command="hide-popover"
              class={[
                "w-full border border-transparent px-2 py-1 text-left text-xs leading-normal font-medium text-neutral-600 transition-colors hover:border-neutral-100 hover:bg-neutral-100 active:border-neutral-200 active:bg-neutral-100 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:active:border-neutral-500 dark:active:bg-neutral-700",
                { hidden: option.value === props.value },
              ]}
              onClick={() => {
                props.onSelect(option.value);
              }}
            >
              {option.label}
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
