<script lang="ts">
  import { base } from "$app/paths";
  import { sizeSettings } from "$lib/appearanceConfig/size/sizeSettings";
  import BaseA from "$lib/base/BaseA.svelte";
  import BaseLabel from "$lib/base/BaseLabel.svelte";
  import type { BaseSize } from "$lib/base/baseSizes";
  import CommonChainExplorerLink from "$lib/common/CommonChainExplorerLink.svelte";
  import CommonItemMember from "$lib/common/CommonItemMember.svelte";
  import CommonOpenLink from "$lib/common/CommonOpenLink.svelte";
  import type {
    Chain,
    Contract,
    Project,
    Version,
  } from "@constants/chains/types";
  import { DIR_NAME_CONTRACTS, NO_DATA } from "@utils/utilsCostants";
  import { getProjectVersionNameForUrl } from "../../projectVersionNameHelper";

  export let targetChain: Chain;
  export let targetProject: Project;
  export let targetVersion: Version;
  export let targetContract: Contract;
  export let activateLinkOfContractName: boolean = false;

  const textSize: BaseSize = sizeSettings.itemMember;

  let hrefToContractName: string;
  $: hrefToContractName =
    `${base}/${targetChain.name}` +
    `/${getProjectVersionNameForUrl(
      targetProject.name,
      targetVersion.name,
    )}/${DIR_NAME_CONTRACTS}/${targetContract.name}`;
</script>

<CommonItemMember text="Contract Name">
  {#if activateLinkOfContractName}
    <BaseA
      text={targetContract.name}
      {textSize}
      href={hrefToContractName}
      prefixIcon={{ name: "scriptText" }}
      openNewTab={false}
    />
  {:else}
    <BaseLabel text={targetContract.name} {textSize} />
  {/if}
</CommonItemMember>
<CommonItemMember text="Address">
  <CommonChainExplorerLink
    subdirectory="address"
    value={targetContract.address}
    {textSize}
  />
</CommonItemMember>
<CommonItemMember text="Source">
  {#if targetContract.sourceCodeUrl}
    <CommonOpenLink
      href={targetContract.sourceCodeUrl}
      text={targetContract.sourceCodeUrl}
      {textSize}
    />
  {:else}
    <BaseLabel text={NO_DATA} {textSize} />
  {/if}
</CommonItemMember>
<slot />
