<script setup>
import AssembliesList from "../components/assemblies/AssembliesList.vue";
import AgentWorkloads from "../components/analytical/AgentWorkloads.vue";
import HoleOffsetsScatter from "../components/analytical/HoleOffsetsScatter.vue";
</script>

<template>
  <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-12">
      <AssembliesList />
    </div>

    <div class="col-lg-3 col-md-4">
      <AgentWorkloads class="m-1"/>
    </div>

    <div class="col-lg-6 col-md-9">
      <HoleOffsetsScatter class="m-1"/>
    </div>
  </div>
  <!-- <main>
  </main> -->
</template>
