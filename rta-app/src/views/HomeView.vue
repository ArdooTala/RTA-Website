<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="row bg_image" style="background-color: black; min-height: 100%">
    <div class="col-12 col-lg-6">
      <div
        class="d-flex justify-content-center align-items-end"
        style="height: 20vh"
      >
        <div class="border-end h-50 w-100">
          <p class="display-1 fw-lighter text-center">RECONWOOD</p>
          <p class="fw-light text-center">RECONFIGURABLE TIMBER ASSEMBLIES</p>
        </div>
      </div>
    </div>

    <div
      class="col-12 col-lg-6 flex-fill d-flex flex-column justify-content-start"
    >
        <div class="d-none d-lg-block" style="height: 10vh"></div>
      <div
        class="border-start p-3"
        style="background-color: rgba(0, 0, 0, 0.75)"
      >
        <router-view />
      </div>
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
