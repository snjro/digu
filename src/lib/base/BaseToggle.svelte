<script lang="ts">
  import {
    colorDefinitions,
    type ColorCategory,
  } from "$lib/appearanceConfig/color/colorDefinitions";
  import type { ThemeColor } from "@db/dbTypes";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import classNames from "classnames";
  import { createEventDispatcher } from "svelte";
  import type { BaseButtonProps } from "./BaseButton.svelte";
  import type { BaseIconProps } from "./BaseIcon";
  import BaseIcon from "./BaseIcon.svelte";
  import BaseTooltip from "./BaseTooltip.svelte";
  import type { BaseSize } from "./baseSizes";
  export let size: BaseSize = "md";
  // export let iconSize: BaseSize = "xl";
  export let colorCategoryThumbToggleOn: ColorCategory = "interactive";
  export let colorCategoryThumbToggleOff: ColorCategory = "interactive";
  export let colorCategoryTrack: ColorCategory;
  export let tooltipText: BaseButtonProps["tooltipText"] = undefined;
  export let tooltipXPosition: BaseButtonProps["tooltipXPosition"] = "right";
  export let tooltipYPosition: BaseButtonProps["tooltipYPosition"] = "top";
  export let disabled: boolean;
  export let toggleValue: boolean;
  export let iconProps: BaseIconProps | undefined = undefined;

  const dispatcher = createEventDispatcher();
  function onToggle(): void {
    toggleValue = !toggleValue;
    dispatcher("toggleChanged");
  }

  const trackSizes: { [key in BaseSize]: string } = {
    xs: "   w-6  h-2",
    sm: "   w-8  h-3",
    md: "   w-10 h-4",
    lg: "   w-12 h-5",
    xl: "   w-14 h-6",
    "2xl": "w-16 h-7",
    "3xl": "w-20 h-8",
    "4xl": "w-24 h-9",
    "5xl": "w-28 h-10",
  };
  const thumbSizes: { [key in BaseSize]: string } = {
    xs: "   w-4  h-4",
    sm: "   w-5  h-5",
    md: "   w-6  h-6",
    lg: "   w-7  h-7",
    xl: "   w-8  h-8",
    "2xl": "w-9  h-9",
    "3xl": "w-10 h-10",
    "4xl": "w-11 h-11",
    "5xl": "w-12 h-12",
  };
  const paddingX: { [key in BaseSize]: string } = {
    xs: "px-1",
    sm: "px-1.5",
    md: "px-2",
    lg: "px-2.5",
    xl: "px-3",
    "2xl": "px-3.5",
    "3xl": "px-4",
    "4xl": "px-4",
    "5xl": "px-5",
  };
  let translateX: { [key in BaseSize]: string };
  $: translateX = {
    xs: toggleValue ? "translate-x-2" : "-translate-x-2",
    sm: toggleValue ? "translate-x-3" : "-translate-x-3",
    md: toggleValue ? "translate-x-4" : "-translate-x-4",
    lg: toggleValue ? "translate-x-5" : "-translate-x-5",
    xl: toggleValue ? "translate-x-6" : "-translate-x-6",
    "2xl": toggleValue ? "translate-x-7" : "-translate-x-7",
    "3xl": toggleValue ? "translate-x-9" : "-translate-x-9",
    "4xl": toggleValue ? "translate-x-10" : "-translate-x-10",
    "5xl": toggleValue ? "translate-x-12" : "-translate-x-12",
  };
  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;

  $: trackClass = classNames(
    trackSizes[size],
    "rounded-full",
    colorDefinitions[themeColor][colorCategoryTrack].bg,
    colorDefinitions[themeColor][colorCategoryTrack].border,
    colorDefinitions[themeColor][colorCategoryTrack].shadow,
    "flex",
    "items-center",
    "justify-center",
    "transition",
    "duration-200",
    "focus:outline-none",
    "shadow dark:shadow-none ",
    "dark:border",
    cursorStyle,
    "",
  );
  let colorCategoryThumb: ColorCategory;
  $: colorCategoryThumb = toggleValue
    ? colorCategoryThumbToggleOn
    : colorCategoryThumbToggleOff;

  $: thumClass = classNames(
    "flex",
    "items-center",
    "justify-center",
    thumbSizes[size],
    "relative",
    "rounded-full",
    "transition",
    "duration-200",
    "transform",
    translateX[size],
    colorDefinitions[themeColor][colorCategoryThumb].bg,
    "dark:border",
    colorDefinitions[themeColor][colorCategoryThumb].border,
    disabled && "contrast-50",
    cursorStyle,
  );

  let cursorStyle: `cursor-${string}`;
  $: cursorStyle = disabled ? "cursor-not-allowed" : "cursor-pointer";
</script>

<div class={classNames(paddingX[size])}>
  <button class={trackClass} on:click={onToggle} {disabled}>
    <BaseTooltip
      text={tooltipText}
      xPosition={tooltipXPosition}
      yPosition={tooltipYPosition}
    >
      <div class={classNames(thumClass)}>
        {#if iconProps}
          <BaseIcon
            name={iconProps.name}
            size={iconProps.size}
            colorCategory={iconProps.colorCategory}
            appendClass={classNames(iconProps.appendClass, cursorStyle)}
          />
        {/if}
      </div>
    </BaseTooltip>
  </button>
</div>
