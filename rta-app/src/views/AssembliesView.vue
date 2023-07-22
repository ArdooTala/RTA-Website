<script setup>
import AssembliesList from "../components/assemblies/AssembliesList.vue";
import AgentWorkloads from "../components/analytical/AgentWorkloads.vue";
import HoleOffsetsScatter from "../components/analytical/HoleOffsetsScatter.vue";
import HoleOffsetsHistogram from "../components/analytical/HoleOffsetsHistogram.vue";
import OperationTimes from "../components/analytical/OperationTimes.vue";
import { ref } from "vue";

let mockData = []
for (let i = 0; i < 23; i++) {
  mockData.push([(Math.random()- 0.5) * 5, (Math.random() - 0.5) * 5])
}

let mockDates = []
let t = new Date(2023, 7, 12, 18, 21, 0, 0).getTime()
for (let i = 0; i < 23; i++) {
  t += Math.random() * 10000 + 1000
  mockDates.push(new Date(t))
}

// console.log(mockData)
// console.log(mockDates)

const holeOffsets = ref(mockData);
</script>

<template>
  <div class="row mt-2">
    <div class="col-lg-4 col-md-6 col-sm-12">
      <AssembliesList />
    </div>

    <div class="col-lg-8 col-md-6 col-sm-12 bg-dark rounded-4">
      <div class="row p-1">

        <div class="col-lg-4 col-md-4 p-1">
          <div class="h-100 border-top border-bottom">
            <AgentWorkloads class="" />
          </div>
        </div>

        <div class="col-lg-8 col-md-12 p-1">
          <div class="h-100 border-top border-bottom">
            <OperationTimes class="" :timestamps="mockDates" />
          </div>
        </div>

        <div class="col-12 p-1">
          <div class="h-100 border-top border-bottom">
            <div class="row m-0">
              <div class="col-lg-6 col-12">
                <HoleOffsetsScatter class="col-3" :holeOffsets="holeOffsets" />
              </div>
              <div class="col-lg-6 col-12">
                <HoleOffsetsHistogram
                  class="col-3"
                  :holeOffsets="holeOffsets"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- <main>
  </main> -->
</template>
