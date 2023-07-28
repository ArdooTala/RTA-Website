<script setup>
import AssembliesList from "../components/assemblies/AssembliesList.vue";
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

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
  <div class="row h-100 mt-1 gx-5">
    <div class="col-12 col-md-6 col-lg-4 col-xl-3 mt-1">
      <AssembliesList />
    </div>

    <div class="col-12 col-md-6 col-lg-8 col-xl-9">
      <router-view />
    </div>
  </div>
</template>
