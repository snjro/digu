<script lang="ts">
  import { colorDefinitions } from "$lib/appearanceConfig/color/colorDefinitions";
  import { colorSettings } from "$lib/appearanceConfig/color/colorSettings";
  import {
    getScrollbarStyle,
    type ScrollbarStyle,
  } from "$lib/appearanceConfig/scrollbar/scrollbarSetting";
  import type { ThemeColor } from "@db/dbTypes";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import classNames from "classnames";
  import ItemHome from "./ItemHome.svelte";
  import ItemProjectVersions from "./ItemProjectVersions.svelte";

  let themeColor: ThemeColor;
  $: themeColor = $storeUserSettings.themeColor;
  let scrollbarStyle: ScrollbarStyle;
  $: scrollbarStyle = getScrollbarStyle(
    colorSettings.leftSidebarBodyBg,
    themeColor,
  );
</script>

<div
  id="leftSidebarBody"
  class={classNames(
    "min-h-0",
    "flex-auto",
    "w-full",
    colorDefinitions[themeColor][colorSettings.leftSidebarBodyBg].bg,
    "overflow-y-scroll",
    scrollbarStyle.thin,
    "",
  )}
>
  <div
    class={classNames(
      "py-1",
      "pr-1",
      "h-fit",
      "w-full",
      "flex",
      "flex-col",
      "",
    )}
  >
    <ItemHome />
    <ItemProjectVersions />
  </div>
</div>
