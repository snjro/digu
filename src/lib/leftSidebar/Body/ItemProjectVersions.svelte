<script lang="ts">
  import { base } from "$app/paths";
  import type { ChainName } from "@constants/chains/types";
  import {
    getProjectVersionNameForLabel,
    getProjectVersionNameForUrl,
  } from "@routes/[chainName]/[projectName_versionName]/projectVersionNameHelper";
  import { storeUserSettings } from "@stores/storeUserSettings";
  import { getTargetChain } from "@utils/utlisDb";
  import ItemProjectVersionsMember from "./ItemProjectVersionsMember.svelte";

  let chainName: ChainName;
  $: chainName = $storeUserSettings.selectedChainName.toString();

  let rootPath: string;
  $: rootPath = `${base}/${chainName}`;

  $: targetChain = getTargetChain({
    chainName: chainName,
  });
</script>

{#each targetChain.projects as targetProject (targetProject.name)}
  {#each targetProject.versions as targetVersion (targetVersion.name)}
    <ItemProjectVersionsMember
      targetProjectVersionNameForLabel={getProjectVersionNameForLabel(
        targetProject.name,
        targetVersion.name,
      )}
      targetProjectVersionHref={`${rootPath}/${getProjectVersionNameForUrl(
        targetProject.name,
        targetVersion.name,
      )}`}
      targetContracts={targetVersion.contracts}
    />
  {/each}
{/each}
