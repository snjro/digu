<script lang="ts" context="module">
  export type BaseSnackbarProps = {
    visible: boolean;
    text?: string;
    iconProps?: BaseIconProps;
    displayTimeInMilliseconds?: number;
  };
</script>

<script lang="ts">
  import { colorDefinitions } from "$lib/appearanceConfig/color/colorDefinitions";
  import { colorSettings } from "$lib/appearanceConfig/color/colorSettings";
  import { zIndex } from "$lib/appearanceConfig/zIndex";
  import type { ThemeColor } from "@db/dbTypes";
  import {
    storeNoDbSnackBar,
    storeNoDbSnackBarInitialValue,
  } from "@stores/storeNoDb";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import classNames from "classnames";
  import { expoInOut } from "svelte/easing";
  import { fly } from "svelte/transition";
  import type { BaseIconProps } from "./BaseIcon";
  import BaseLabel from "./BaseLabel.svelte";
  import type { BaseSize } from "./baseSizes";

  const displayTimeInMilliseconds: number = 1000;

  $: (async () => {
    if ($storeNoDbSnackBar.visible) {
      await setTimeout(() => {
        $storeNoDbSnackBar = { ...storeNoDbSnackBarInitialValue };
      }, $storeNoDbSnackBar.displayTimeInMilliseconds ?? displayTimeInMilliseconds);
    }
  })();

  let frameLineStyle: string;
  $: frameLineStyle = classNames(
    themeColor === "light"
      ? classNames(
          "shadow-md",
          colorDefinitions[themeColor][colorSettings.snackBarBg].shadow,
        )
      : classNames(
          "border",
          colorDefinitions[themeColor][colorSettings.snackBarBg].border,
        ),
  );

  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;

  const positionStyle: string = classNames(
    "fixed",
    "bottom-3",
    "right-6",
    zIndex.snackbar,
  );
  const textSize: BaseSize = "xl";
</script>

{#if $storeNoDbSnackBar.visible}
  <div
    transition:fly={{
      delay: 0,
      duration: 150,
      x: 100,
      y: 0,
      opacity: 0.5,
      easing: expoInOut,
    }}
    class={classNames(
      positionStyle,
      "p-4",
      "rounded",
      frameLineStyle,
      colorDefinitions[themeColor][colorSettings.snackBarBg].bg,
    )}
  >
    <BaseLabel
      text={$storeNoDbSnackBar.text}
      colorCategoryFront={colorSettings.snackBarFront}
      {textSize}
      prefixIcon={$storeNoDbSnackBar.iconProps}
    />
  </div>
{/if}
