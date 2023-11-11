<script setup>
import AssembledPartsList from "./operations/AssembledPartsList.vue";
import AgentWorkloads from "./analytical/AgentWorkloads.vue";
import SuccessRates from "./analytical/SuccessRates.vue";
import SuccessRateParts from "./analytical/SuccessRateParts.vue";
import HoleOffsetsHistogram from "./analytical/HoleOffsetsHistogram.vue";
import OperationTimes from "./analytical/OperationTimes.vue";
import AggregateTimes from "./analytical/AggregateTimes.vue";
import PartTimes from "./analytical/PartTimes.vue";

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

    <div class="col-12 row h-100 d-block justify-content-around" id="dashboard">

      <div class="col-12">
        <p class="mb-auto display-1 text-center">
          <i class="bi bi-headset-vr"></i>
          +
          <i class="bi bi-screwdriver"></i>
          {{ assembly_url || "OVERVIEW" }}
        </p>
        <!-- <div class="border-top border-bottom p-1">
          <AssembledPartsList :assembly_name="assembly_url" />
        </div> -->
      </div>

      <!-- <div class="col-12 p-1 row"> -->

      <!-- <div class="col-12 col-lg-6 border-top border-bottom p-1">
          <AgentWorkloads :assembly_name="assembly_url" />
        </div> -->

      <!-- <div class="col-12 col-lg-6 border-top border-bottom p-1">
          <SuccessRates :assembly_name="assembly_url" />
        </div> -->

      <!-- </div> -->


      <!-- <div class="col-12 p-1 row"> -->

      <!-- <div class="col-12 border-top border-bottom p-1">
          <AggregateTimes class="" :assembly_name="assembly_url" />
        </div> -->

      <!-- </div> -->

      <div class="col-12 p-1 row">

        <div class="col-12 col-lg-12 border-top border-bottom p-1">
          <PartTimes class="" :assembly_name="assembly_url" :manual="true" />
        </div>

      </div>

      <div class="col-12 p-1 row">

        <div class="col-12 col-lg-12 border-top border-bottom p-1">
          <OperationTimes class="" :assembly_name="assembly_url" :manual="true" />
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped></style>
