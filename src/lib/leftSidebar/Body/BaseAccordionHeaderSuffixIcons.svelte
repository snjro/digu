<script lang="ts" context="module">
  export type BaseAccordionHeaderSuffixIcon = {
    name: BaseIconProps["name"];
    size: BaseSize;
  };
</script>

<script lang="ts">
  import {
    colorDefinitions,
    type ColorCategory,
  } from "$lib/appearanceConfig/color/colorDefinitions";
  import { sizeSettings } from "$lib/appearanceConfig/size/sizeSettings";
  import type { BaseIconProps } from "$lib/base/BaseIcon";
  import BaseIcon from "$lib/base/BaseIcon.svelte";
  import type { BaseSize } from "$lib/base/baseSizes";
  import type { ThemeColor } from "@db/dbTypes";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import classNames from "classnames";
  import type { HoverType } from "./BaseAccordionHeader.svelte";
  import { leftSidebarItemRoundedStyle } from "./BaseItem.svelte";
  import { getFrontColorCategory } from "./fontStyle";

  export let height: `h-${string}`;
  export let bgColor: `bg-${string}` | undefined;
  export let isSelected: boolean;
  export let hoverType: HoverType;
  export let isOpenAccordion = true;
  export let suffixIcons: BaseAccordionHeaderSuffixIcon[];

  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;

  let frontColorCategory: ColorCategory;
  $: frontColorCategory = getFrontColorCategory(isSelected);

  let shevronUnderlineStyle: string;
  $: shevronUnderlineStyle =
    hoverType === "onSpace"
      ? classNames(
          "border-b",
          colorDefinitions[themeColor]["interactive"].border,
        )
      : "";
</script>

<div
  role="button"
  tabindex="0"
  class={classNames(
    "grow",
    "flex",
    "flex-row",
    "items-center",
    bgColor,
    height,
    "justify-end",
    "pr-1",
    leftSidebarItemRoundedStyle,
    "",
  )}
  on:click
  on:mouseenter
  on:mouseleave
  on:keydown
>
  {#if suffixIcons.length > 0}
    <div class={classNames("grow", "justify-end", "flex", "flex-row")}>
      {#each suffixIcons as suffixIcon}
        <BaseIcon
          isHover={hoverType !== undefined}
          name={suffixIcon.name}
          size={suffixIcon.size}
          colorCategory={frontColorCategory}
        />
      {/each}
    </div>
  {/if}

  <BaseIcon
    name={isOpenAccordion ? "chevronDown" : "chevronRight"}
    size={sizeSettings.leftSidebarChevronIcon}
    isHoverControledByParent
    isHover={hoverType !== undefined}
    colorCategory={frontColorCategory}
    appendClass={shevronUnderlineStyle}
  />
</div>
