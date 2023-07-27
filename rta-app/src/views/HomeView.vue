<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="row h-100">
    <div class="col-12 col-lg-6 bg_image">
      <div class="h-25 d-flex flex-column justify-content-end">
        <div class="border-end">
          <p class="display-1 fw-lighter text-center">RECONWOOD</p>
          <p class="fw-light text-center">RECONFIGURABLE TIMBER ASSEMBLIES</p>
        </div>
      </div>
    </div>

    <div
      class="col-sm-12 col-lg-6 flex-fill d-flex flex-column justify-content-center"
      style="background-color: black"
    >
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.bg_image {
  background-image: url("src/assets/BG_2.jpg");
  /* background-size: cover; */
  background-size: auto 100%;
  background-position: center;
}
</style>
