<script setup>
import AssemblyCard from "./AssemblyCard.vue";
import AgentWorkloads from "./analytical/AgentWorkloads.vue";
import SuccessRates from "./analytical/SuccessRates.vue";
import SuccessRateParts from "./analytical/SuccessRateParts.vue";
import HoleOffsetsScatter from "./analytical/HoleOffsetsScatter.vue";
import HoleOffsetsHistogram from "./analytical/HoleOffsetsHistogram.vue";
import OperationTimes from "./analytical/OperationTimes.vue";

import { ref, defineProps, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const props = defineProps(["assembly_name"]);
const assembly_url = ref(props.assembly_name);

console.log("PROPS.ASS_NAME " + props.assembly_name);
console.log("PROPS.ASS_URL  " + assembly_url.value);

watch(
  () => props.assembly_name,
  (new_assembly_name) => {
    assembly_url.value = new_assembly_name;
    console.log("WATCH " + assembly_url.value);
  }
);

let mockDates = [];
let t = new Date(2023, 7, 12, 18, 21, 0, 0).getTime();
for (let i = 0; i < 23; i++) {
  t += Math.random() * 10000 + 1000;
  mockDates.push(new Date(t));
}
</script>

<template>
  <div class="row h-100 d-block d-lg-flex flex-column justify-content-around">
    <div class="col-12 p-1 row" style="flex-basis: 0%; flex-grow: 2">
      <div class="col-12 col-lg-8">
        <p class="mb-auto display-4">{{ assembly_url || "OVERVIEW" }}</p>
        <div class="border-top border-bottom p-1">
          <AssemblyCard class="">
            <template #start>Start Time</template>
            <template #end>End Time</template>
            <template #parts_count>23</template>
          </AssemblyCard>
        </div>
      </div>

      <div class="col-6 col-lg-2">
        <div class="border-top border-bottom p-1 h-100 w-100">
          <AgentWorkloads :assembly_name="assembly_url" style="height: 95%;" />
        </div>
      </div>

      <div class="col-6 col-lg-2">
        <div class="border-top border-bottom p-1 h-100 w-100">
            <SuccessRateParts :assembly_name="assembly_url" style="height: 95%;"/>
        </div>
      </div>
    </div>

    <div class="col-12 p-1 row" style="flex-basis: 0%; flex-grow: 3">
      <div class="col-12 col-lg-3">
        <div class="border-top border-bottom p-1 h-100 w-100">
          <SuccessRates :assembly_name="assembly_url" style="height: 95%;"/>
        </div>
      </div>

      <div class="col-12 col-lg-9">
        <div class="border-top border-bottom p-1 h-100 w-100">
          <OperationTimes class="" :timestamps="mockDates" style="height: 95%;" />
        </div>
      </div>
    </div>

    <div class="col-12 p-1 row" style="flex-basis: 0%; flex-grow: 3">
      <div class="col-12 col-lg-6">
        <div class="border-top border-bottom p-2 h-100 w-100">
          <HoleOffsetsScatter :assembly_name="assembly_url" style="height: 95%;" />
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="border-top border-bottom p-2 pt-4 h-100 w-100">
          <HoleOffsetsHistogram :assembly_name="assembly_url" style="height: 95%;" />
        </div>
      </div>
    </div>
  </div>
</template>
