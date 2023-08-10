<script setup>
import MaterialsList from "../components/materials/MaterialsList.vue";
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

const holeOffsets = ref();
</script>

<template>
    <router-view />
</template>
