<script lang="ts" context="module">
  export type BaseAProps = {
    href: string | undefined;
    text?: string;
    colorCategory?: ColorCategory;
    textSize?: BaseSize;
    forcedClass?: string;
    appendClass?: string;
    prefixIcon?: BaseIconProps;
    suffixIcon?: BaseIconProps;
    disabled?: boolean;
    isHoverControledByParent?: boolean;
    openNewTab?: boolean;
    hoverEffect?: boolean;
    truncate?: boolean;
  };
  export const setPropsByOpenNewTab = (
    openNewTab: boolean,
  ): { target: string; rel: string } | undefined => {
    if (openNewTab) {
      return { target: "_blank", rel: "noreferrer noopener" };
    } else {
      return undefined;
    }
  };
</script>

<script lang="ts">
  import {
    colorDefinitions,
    type ColorCategory,
  } from "$lib/appearanceConfig/color/colorDefinitions";
  import type { ThemeColor } from "@db/dbTypes";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import { NO_DATA } from "@utils/utilsCostants";
  import classNames from "classnames";
  import { twMerge } from "tailwind-merge";
  import type { BaseIconProps } from "./BaseIcon";
  import BaseIcon from "./BaseIcon.svelte";
  import type { BaseSize } from "./baseSizes";
  import { baseTextSizes } from "./baseSizes";
  export let href: BaseAProps["href"];
  export let text: BaseAProps["text"] = undefined;
  export let colorCategory: BaseAProps["colorCategory"] = undefined;
  export let textSize: BaseSize = "md";
  export let forcedClass: BaseAProps["forcedClass"] = undefined;
  export let appendClass: BaseAProps["appendClass"] = undefined;
  export let prefixIcon: BaseAProps["prefixIcon"] = undefined;
  export let suffixIcon: BaseAProps["suffixIcon"] = undefined;
  export let disabled: NonNullable<BaseAProps["disabled"]> = false;
  export let openNewTab: NonNullable<BaseAProps["openNewTab"]> = true;
  export let isFontMono: boolean = false;
  export let isHoverControledByParent: NonNullable<
    BaseAProps["isHoverControledByParent"]
  > = false;
  export let hoverEffect: NonNullable<BaseAProps["hoverEffect"]> = true;
  export let truncate: NonNullable<BaseAProps["truncate"]> = true;
  let isHover = false;
  function onMouseEnter() {
    if (!isHoverControledByParent) isHover = true;
  }
  function onMouseLeave() {
    if (!isHoverControledByParent) isHover = false;
  }
  $: editIconProps = (
    iconProps: BaseIconProps | undefined,
  ): BaseIconProps | undefined => {
    if (iconProps) {
      iconProps.isHover = isHover;
      if (!iconProps.size) {
        iconProps.size = textSize;
      }
      if (!iconProps.colorCategory) {
        iconProps.colorCategory = colorCategory ?? "interactive";
      }
    }
    return iconProps;
  };
  if (!text) {
    text = href;
  }
  $: editedPrefixIcon = editIconProps(prefixIcon);
  $: editedSuffixIcon = editIconProps(suffixIcon);
  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;
  let customClass: string;
  $: customClass =
    forcedClass ??
    twMerge(
      "flex",
      "items-center",
      "space-x-1",
      "cursor-pointer",
      "max-w-fit",
      "overflow-x-hidden",
      "whitespace-nowrap",
      // "w-fit",
      hoverEffect && "hover:underline",
      baseTextSizes[textSize],
      colorDefinitions[themeColor][colorCategory ?? "interactive"].text,
      disabled && "disabled:opacity-75",
      disabled && "pointer-events: none",
      isFontMono && "font-mono",
      appendClass,
    );
</script>

<a
  href={href ?? NO_DATA}
  class={customClass}
  {...setPropsByOpenNewTab(openNewTab)}
  on:click
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  {#if editedPrefixIcon}
    <BaseIcon {...editedPrefixIcon} />
  {/if}
  {#if $$slots.anchorContent}
    <slot name="anchorContent" />
  {:else}
    <p class={classNames(truncate && "truncate")}>{text ?? NO_DATA}</p>
  {/if}
  {#if editedSuffixIcon}
    <BaseIcon {...editedSuffixIcon} />
  {/if}
</a>
