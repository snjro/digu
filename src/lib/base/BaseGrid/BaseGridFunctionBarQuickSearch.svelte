<script lang="ts">
  import { colorSettings } from "$lib/appearanceConfig/color/colorSettings";
  import { sizeSettings } from "$lib/appearanceConfig/size/sizeSettings";
  import BaseButtonIcon from "$lib/base/BaseButtonIcon.svelte";
  import BaseIcon from "$lib/base/BaseIcon.svelte";
  import BaseInput from "$lib/base/BaseInput.svelte";
  import { changeSize, type BaseSize } from "$lib/base/baseSizes";
  import type { GridApi } from "ag-grid-community";
  import classNames from "classnames";

  export let gridApi: GridApi;
  export let quickSearchText: string;
  $: {
    gridApi?.setGridOption("quickFilterText", quickSearchText);
  }
  const size: BaseSize = sizeSettings.gridFunctionQuickSearch;
</script>

<div class={classNames("max-w-2xl", "min-w-min", "w-full")}>
  <BaseInput
    placeholder="Quick search..."
    type="text"
    {size}
    bind:value={quickSearchText}
    colorCategory={colorSettings.gridFunctionInput}
    colorCategoryBorder={colorSettings.gridFunctionInputBorder}
  >
    <BaseIcon
      slot="prefixIcon"
      name="magnify"
      {size}
      hoverEffect={false}
      colorCategory={colorSettings.gridFunctionInput}
    />
    <BaseButtonIcon
      slot="suffixIcon"
      size={changeSize(size, -1)}
      tooltipText="clear"
      tooltipXPosition="right"
      tooltipYPosition="bottom"
      iconName="close"
      colorCategoryBg={colorSettings.gridFunctionButton}
      colorCategoryFront={colorSettings.gridFunctionButton}
      on:click={() => {
        quickSearchText = "";
      }}
    />
  </BaseInput>
</div>
