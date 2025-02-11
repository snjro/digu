<script lang="ts" context="module">
  export type BaseButtonProps = {
    type: "icon" | "normal";
    label?: string;
    pill?: boolean;
    size?: BaseSize;
    href?: string;
    openNewTab?: boolean;
    border?: boolean;
    forcedClass?: string;
    appendClass?: string;
    justify: keyof typeof justifyPositions;
    disabled?: boolean;
    tooltipText?: BaseTooltipProps["text"];
    tooltipXPosition?: BaseTooltipProps["xPosition"];
    tooltipYPosition?: BaseTooltipProps["yPosition"];
    colorCategoryFront?: ColorCategory;
    colorCategoryBg?: ColorCategory;
    noPadding?: boolean;
    hoverEffect?: boolean;
    shadowEffect?: boolean;
    popupEffect?: boolean;
    opacityEffect?: boolean;
    designatedFontWeight?: BaseLabelProps["fontWeight"];
    underlineLabel: boolean;
    rounded: boolean;
  };
  const justifyPositions = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
    around: "justify-around",
    evenly: "justify-evenly",
  };
  const paddingSizes: {
    [key in BaseButtonProps["type"]]: { [key in BaseSize]: string };
  } = {
    normal: {
      xs: "px-1 py-1 space-x-1",
      sm: "px-3 py-1 space-x-3",
      md: "px-3 py-1.5 space-x-3",
      lg: "px-5 py-1.5 space-x-5",
      xl: "px-5 py-2 space-x-5",
      "2xl": "px-6 py-2 space-x-6",
      "3xl": "px-7 py-2.5 space-x-7",
      "4xl": "px-8 py-2.5 space-x-8",
      "5xl": "px-9 py-3 space-x-9",
    },
    icon: {
      xs: "p-[1px]",
      sm: "p-0.5",
      md: "p-0.5",
      lg: "p-0.5",
      xl: "p-0.5",
      "2xl": "p-0.5",
      "3xl": "p-0.5",
      "4xl": "p-0.5",
      "5xl": "p-0.5",
    },
  };
</script>

<script lang="ts">
  import { twMerge } from "tailwind-merge";

  import {
    colorDefinitions,
    type ColorCategory,
  } from "$lib/appearanceConfig/color/colorDefinitions";
  import type { ThemeColor } from "@db/dbTypes";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import classNames from "classnames";
  import { createEventDispatcher } from "svelte";
  import BaseA from "./BaseA.svelte";
  import BaseButtonContent from "./BaseButtonContent.svelte";
  import type { BaseLabelProps } from "./BaseLabel.svelte";
  import BaseTooltip, { type BaseTooltipProps } from "./BaseTooltip.svelte";
  import type { BaseSize } from "./baseSizes";
  import { baseShadowSizes, baseTextHeight, baseTextSizes } from "./baseSizes";

  export let type: NonNullable<BaseButtonProps["type"]> = "normal";
  export let label: BaseButtonProps["label"] = undefined;
  export let size: NonNullable<BaseButtonProps["size"]> = "md";
  export let href: BaseButtonProps["href"] = undefined;
  export let openNewTab: NonNullable<BaseButtonProps["openNewTab"]> = false;
  export let border: NonNullable<BaseButtonProps["border"]> = false;
  export let forcedClass: BaseButtonProps["forcedClass"] = undefined;
  export let appendClass: BaseButtonProps["appendClass"] = undefined;
  export let disabled: NonNullable<BaseButtonProps["disabled"]> = false;
  export let noPadding: NonNullable<BaseButtonProps["noPadding"]> = false;
  export let hoverEffect: NonNullable<BaseButtonProps["hoverEffect"]> = true;
  export let shadowEffect: NonNullable<BaseButtonProps["shadowEffect"]> = true;
  export let popupEffect: NonNullable<BaseButtonProps["popupEffect"]> = true;
  export let justify: NonNullable<BaseButtonProps["justify"]> = "center";
  export let tooltipText: BaseButtonProps["tooltipText"] = undefined;
  export let tooltipXPosition: BaseButtonProps["tooltipXPosition"] = "right";
  export let tooltipYPosition: BaseButtonProps["tooltipYPosition"] = "top";
  export let colorCategoryFront: BaseButtonProps["colorCategoryFront"] =
    undefined;
  export let colorCategoryBg: BaseButtonProps["colorCategoryBg"] = undefined;
  export let isHover: boolean = false;
  export let isHoverControledByParent: boolean = false;
  export let underlineLabel: BaseButtonProps["underlineLabel"] = false;
  export let designatedFontWeight: BaseButtonProps["designatedFontWeight"] =
    undefined;
  export let rounded: BaseButtonProps["rounded"] = true;

  const dispatch = createEventDispatcher();
  function onMouseEnter(event: MouseEvent) {
    if (!isHoverControledByParent) isHover = true;
    dispatch("mouseenter", event.detail);
  }
  function onMouseLeave(event: MouseEvent) {
    if (!isHoverControledByParent) isHover = false;
    dispatch("mouseleave", event.detail);
  }
  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;

  $: textColor = (): string => {
    let textColor: string;
    if (hoverEffect && isHover) {
      if (colorCategoryFront) {
        textColor =
          colorDefinitions[themeColor][colorCategoryFront].textEmphasis;
      } else {
        textColor = "text-inherit";
      }
    } else {
      if (colorCategoryFront) {
        textColor = colorDefinitions[themeColor][colorCategoryFront].text;
      } else {
        textColor = "text-inherit";
      }
    }
    return textColor;
  };
  $: bgColor = () => {
    let bgColor: string;
    if (hoverEffect && isHover) {
      if (colorCategoryBg) {
        bgColor = colorDefinitions[themeColor][colorCategoryBg].bgEmphasis;
      } else {
        bgColor = "bg-inherit";
      }
    } else {
      if (colorCategoryBg) {
        bgColor = colorDefinitions[themeColor][colorCategoryBg].bg;
      } else {
        bgColor = "bg-inherit";
      }
    }
    return bgColor;
  };
  $: borderColor = (): string => {
    let borderColor: string = "";
    if (border) {
      if (colorCategoryFront) {
        borderColor = colorDefinitions[themeColor][colorCategoryFront].border;
      } else {
        borderColor = "border-inherit";
      }
      borderColor = classNames("border", borderColor);
    }

    return borderColor;
  };
  $: shadowColor = (): string => {
    if (shadowEffect) {
      return colorCategoryBg
        ? colorDefinitions[themeColor][colorCategoryBg].shadow
        : "shadow-inherit";
    }
    return "shadow-inherit";
  };
  $: padding = (): string => {
    let padding: string;
    if (noPadding) {
      padding = "p-0";
    } else {
      padding = paddingSizes[type][size];
    }
    return padding;
  };
  let customClass: string;
  $: customClass =
    forcedClass ??
    twMerge(
      // "lg:text-center",
      "inline-flex",
      "items-center",
      "disabled:cursor-not-allowed",
      "disabled:opacity-50",
      label ? "w-fit" : baseTextHeight[size].replace("h-", "w-"),
      baseTextHeight[size],
      "cursor-pointer",
      justifyPositions[justify],
      bgColor(),
      textColor(),
      borderColor(),
      type === "normal" && baseTextSizes[size],
      !href && padding(),
      rounded && "rounded",
      // "relative",
      shadowEffect && "flex items-center",
      shadowEffect && baseShadowSizes[size],
      "dark:shadow-none",
      !disabled && "active:shadow-none",
      shadowColor(),
      shadowEffect && "active:border-none",
      // !shadowEffect && "top-[2px]",
      label && "truncate",
      popupEffect && "active:translate-y-px",
      appendClass,
    );
</script>

<BaseTooltip
  text={tooltipText}
  xPosition={tooltipXPosition}
  yPosition={tooltipYPosition}
>
  <button
    class={customClass}
    {disabled}
    on:click
    on:change
    on:keydown
    on:keyup
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}
    on:animationend
  >
    {#if href}
      <BaseA
        {openNewTab}
        {href}
        forcedClass={classNames(
          "inline-flex",
          "items-center",
          "truncate",
          "w-fit",
          padding(),
        )}
      >
        <BaseButtonContent
          slot="anchorContent"
          {label}
          {size}
          {underlineLabel}
          {designatedFontWeight}
        >
          <slot slot="prefixIcon" name="prefixIcon" />
          <slot slot="suffixIcon" name="suffixIcon" />
        </BaseButtonContent>
      </BaseA>
    {:else}
      <BaseButtonContent {label} {size} {underlineLabel} {designatedFontWeight}>
        <slot slot="prefixIcon" name="prefixIcon" />
        <slot slot="suffixIcon" name="suffixIcon" />
      </BaseButtonContent>
    {/if}
  </button>
</BaseTooltip>
