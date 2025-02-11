<svelte:options accessors={true} />

<script lang="ts" context="module">
  export type BaseInputProps = {
    type: HTMLInputTypeAttribute;
    value?: string | number;
    size?: BaseSize;
    forcedClass?: string;
    appendClass?: string;
    colorCategory: ColorCategory;
    disabled?: boolean;
    border?: boolean;
    truncate?: boolean;
    placeholder?: string;
    labelProps?: BaseLabelProps;
    helperTextState?: HelperTextState;
  };
</script>

<script lang="ts">
  import {
    colorDefinitions,
    type ColorCategory,
  } from "$lib/appearanceConfig/color/colorDefinitions";
  import type { HelperTextState } from "$lib/nav/settings/rpcConfig/RpcConfigChanger.svelte";
  import type { ThemeColor } from "@db/dbTypes";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import classNames from "classnames";
  import type { HTMLInputTypeAttribute } from "svelte/elements";
  import BaseLabel, { type BaseLabelProps } from "./BaseLabel.svelte";
  import type { BaseSize } from "./baseSizes";
  import { baseTextSizes } from "./baseSizes";

  export let type: BaseInputProps["type"];
  export let value: BaseInputProps["value"] = undefined;
  export let size: NonNullable<BaseInputProps["size"]> = "md";
  export let forcedClass: BaseInputProps["forcedClass"] = undefined;
  export let appendClass: BaseInputProps["appendClass"] = undefined;
  export let colorCategory: ColorCategory;
  export let colorCategoryBorder: ColorCategory;
  export let disabled: NonNullable<BaseInputProps["disabled"]> = false;
  export let truncate: NonNullable<BaseInputProps["truncate"]> = true;
  export let labelProps: BaseInputProps["labelProps"] = undefined;
  export let helperTextState: BaseInputProps["helperTextState"] = undefined;
  export let placeholder: BaseInputProps["placeholder"] = undefined;
  const inputPaddingSizes: { [key in BaseSize]: string } = {
    xs: "px-0.5 py-0.5",
    sm: "px-1 py-0.5",
    md: "px-1 py-1",
    lg: "px-1 py-1",
    xl: "px-1 py-1.5",
    "2xl": "px-1 py-1.5",
    "3xl": "px-1 py-2",
    "4xl": "px-1 py-2",
    "5xl": "px-2 py-2.5",
  };
  const prefixIconPaddingSizes: { [key in BaseSize]: string } = {
    xs: "pl-1",
    sm: "pl-1.5",
    md: "pl-2",
    lg: "pl-2",
    xl: "pl-2.5",
    "2xl": "pl-3",
    "3xl": "pl-3.5",
    "4xl": "pl-3.5",
    "5xl": "pl-4",
  };
  const sufixIconPaddingSizes: { [key in BaseSize]: string } = {
    xs: "pr-1",
    sm: "pr-1.5",
    md: "pr-2",
    lg: "pr-2",
    xl: "pr-2.5",
    "2xl": "pr-3",
    "3xl": "pr-3.5",
    "4xl": "pr-3.5",
    "5xl": "pr-4",
  };

  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;

  let customClass: string;
  $: customClass =
    forcedClass ??
    classNames(
      "w-full",
      truncate && "truncate",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      "bg-transparent",
      colorDefinitions[themeColor][colorCategory].text,
      "placeholder:italic",
      colorDefinitions[themeColor][colorCategory].textPlaceholder,
      baseTextSizes[size],
      inputPaddingSizes[size],
      "noborder",
      appendClass,
    );
  const handleInput = (event: Event): void => {
    value = (event.target as HTMLInputElement).value;
  };
  let isFocus: boolean = false;
  const setFocused = (value: boolean) => {
    isFocus = value;
  };
  let borderStyle: string;
  $: borderStyle = classNames(
    "border-2",
    isFocus
      ? colorDefinitions[themeColor]["interactive"].border
      : colorDefinitions[themeColor][colorCategoryBorder].border,
    "",
  );
  let shadowStyle: string;
  $: shadowStyle = classNames(
    themeColor === "light" &&
      classNames(
        "shadow-inner",
        colorDefinitions[themeColor][colorCategory].shadow,
      ),
  );
</script>

<div
  class={classNames(
    "flex",
    "flex-col",
    "h-fit",
    "w-full",
    "justify-items-start",
  )}
>
  {#if labelProps}
    <BaseLabel {...labelProps} />
  {/if}
  <div
    class={classNames(
      "flex",
      "flex-row",
      "items-center",
      "justify-items-start",
      "rounded-md",
      shadowStyle,
      borderStyle,
      colorDefinitions[themeColor][colorCategory].bg,
    )}
  >
    {#if $$slots.prefixIcon}
      <div
        class={classNames(
          prefixIconPaddingSizes[size],
          "flex",
          "items-center",
          "justify-items-start",
        )}
      >
        <slot name="prefixIcon" />
      </div>
    {/if}
    <input
      {type}
      value={value ?? ""}
      spellcheck={false}
      {disabled}
      placeholder={isFocus ? undefined : placeholder}
      on:blur={() => {
        setFocused(false);
      }}
      on:blur
      on:change
      on:click
      on:focus={() => {
        setFocused(true);
      }}
      on:focus
      on:keydown
      on:keypress
      on:keyup
      on:mouseover
      on:mouseenter
      on:mouseleave
      on:paste
      on:input={handleInput}
      class={customClass}
    />
    {#if $$slots.suffixIcon}
      <div
        class={classNames(
          sufixIconPaddingSizes[size],
          "flex",
          "items-center",
          "justify-items-start",
        )}
      >
        <slot name="suffixIcon" />
      </div>
    {/if}
  </div>
  {#if $$slots.inputHelper}
    <div
      class={classNames("h-5", "font-light", {
        invisible: !helperTextState,
      })}
    >
      <slot name="inputHelper" />
    </div>
  {/if}
</div>

<style lang="scss">
  .noborder {
    &:focus {
      outline: none !important;
      border: none !important;
    }
  }
</style>
