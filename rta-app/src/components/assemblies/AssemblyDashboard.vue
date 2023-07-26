<script setup>
import AssemblyCard from "./AssemblyCard.vue";
import EcosystemIcon from "../icons/IconEcosystem.vue";
import AgentWorkloads from "./analytical/AgentWorkloads.vue";
import HoleOffsetsScatter from "./analytical/HoleOffsetsScatter.vue";
import HoleOffsetsHistogram from "./analytical/HoleOffsetsHistogram.vue";
import OperationTimes from "./analytical/OperationTimes.vue";

import { ref, defineProps, watch } from "vue";
import { useRoute } from 'vue-router'

const route = useRoute()
const props = defineProps(["assembly_name"]);
const assembly_url = ref(props.assembly_name);

console.log("PROPS.ASS_NAME " + props.assembly_name);
console.log("PROPS.ASS_URL  " + assembly_url.value);

watch(
  () => props.assembly_name,
  new_assembly_name => {
    assembly_url.value = new_assembly_name;
    console.log("WATCH " + assembly_url.value)
  }
);

let mockData = [];
for (let i = 0; i < 23; i++) {
  mockData.push([(Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5]);
}

let mockDates = [];
let t = new Date(2023, 7, 12, 18, 21, 0, 0).getTime();
for (let i = 0; i < 23; i++) {
  t += Math.random() * 10000 + 1000;
  mockDates.push(new Date(t));
}

const holeOffsets = ref(mockData);
</script>

<template>
  <div class="row p-1">
    <div class="col-lg-8 col-md-12 p-1">
      <div class="h-100 border-top border-bottom">
        <AssemblyCard class="">
          <template #icon><EcosystemIcon /></template>
          <template #start>Start Time</template>
          <template #end>End Time</template>
          <template #parts_count>23</template>
        </AssemblyCard>
      </div>
    </div>

    <div class="col-lg-4 col-md-4 p-1">
        <h1>{{ assembly_url }}</h1>
      <div class="h-100 border-top border-bottom">
        <AgentWorkloads :assembly_name="assembly_url" />
      </div>
    </div>

    <div class="col-lg-12 col-md-12 p-1">
      <div class="h-100 border-top border-bottom">
        <OperationTimes class="" :timestamps="mockDates" />
      </div>
    </div>

    <div class="col-12 p-1">
      <div class="h-100 border-top border-bottom">
        <div class="row m-0">
          <div class="col-lg-6 col-12">
            <HoleOffsetsScatter class="col-3" :holeOffsets="holeOffsets" :assembly_name="assembly_url" />
          </div>
          <div class="col-lg-6 col-12">
            <HoleOffsetsHistogram class="col-3" :holeOffsets="holeOffsets" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
