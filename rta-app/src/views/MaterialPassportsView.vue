<script setup>
import MaterialsList from "../components/materials/MaterialsList.vue";
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

const holeOffsets = ref();
</script>

<template>
  <div class="row h-100 mt-1 gx-5">
    <div class="col-12 col-md-6 col-lg-4 col-xl-3 mt-1">
      <MaterialsList />
    </div>

    <div class="col-12 col-md-6 col-lg-8 col-xl-9">
      <router-view />
    </div>
  </div>
</template>