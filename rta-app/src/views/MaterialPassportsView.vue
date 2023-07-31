<script setup>
import MaterialsList from "../components/materials/MaterialsList.vue";
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

const holeOffsets = ref();
</script>

<template>
  <div class="row h-100 mt-1 gx-5">
    <div class="col-12 col-md-9 col-lg-6 col-xl-5 mt-1">
      <MaterialsList />
    </div>

    <div class="col-12 col-md-3 col-lg-6 col-xl-7">
      <router-view />
    </div>
  </div>
</template>