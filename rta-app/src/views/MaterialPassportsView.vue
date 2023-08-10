<script setup>
import MaterialsList from "../components/materials/MaterialsList.vue";
import { RouterLink, RouterView } from "vue-router";
import { ref } from "vue";

const holeOffsets = ref();
</script>

<template>
    <div class="row h-100 mt-1">
        <router-view />
    </div>
</template>
