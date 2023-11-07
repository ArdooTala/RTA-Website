<script setup>
import AssembledPartsList from "./operations/AssembledPartsList.vue";
import AgentWorkloads from "./analytical/AgentWorkloads.vue";
import SuccessRates from "./analytical/SuccessRates.vue";
import SuccessRateParts from "./analytical/SuccessRateParts.vue";
import HoleOffsetsHistogram from "./analytical/HoleOffsetsHistogram.vue";
import OperationTimes from "./analytical/OperationTimes.vue";
import AggregateTimes from "./analytical/AggregateTimes.vue";

import { ref, defineProps, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps(["assembly_name"]);
const assembly_url = ref(props.assembly_name);

watch(
  () => props.assembly_name,
  (new_assembly_name) => {
    assembly_url.value = new_assembly_name;
    // console.log("WATCH " + assembly_url.value);
  }
);
</script>

<template>
  <div class="row h-100">
    <div class="col-12 col-lg-4">
      <p class="mb-auto display-3 text-center">{{ assembly_url || "OVERVIEW" }}</p>
      <div class="border-top border-bottom p-1">
        <AssembledPartsList :assembly_name="assembly_url" />
      </div>
    </div>

    <div class="col-12 col-lg-8 row h-100 d-block justify-content-around" id="dashboard">

      <div class="col-12 p-1 row">

        <div class="col-12 col-lg-6 border-top border-bottom p-1">
          <AgentWorkloads :assembly_name="assembly_url" />
        </div>

        <div class="col-12 col-lg-6 border-top border-bottom p-1">
          <SuccessRates :assembly_name="assembly_url" />
        </div>

      </div>
      
      <div class="col-12 p-1 row">

        <div class="col-6 col-lg-9 border-top border-bottom p-1">
          <OperationTimes class="" :assembly_name="assembly_url" />
        </div>

        <div class="col-6 col-lg-3 border-top border-bottom p-1">
          <AggregateTimes class="" :assembly_name="assembly_url" />
        </div>

      </div>

      <div class="col-12 p-1 row">

        <div class="col-12 col-lg-6 border-top border-bottom p-2 p2">
          <HoleOffsetsHistogram :assembly_name="assembly_url" />
        </div>

      </div>


    </div>
  </div>
</template>

<style scoped>

</style>
