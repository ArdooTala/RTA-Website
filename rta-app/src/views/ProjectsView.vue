<script setup>
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

const props = defineProps(["project_name"])
const assemblyOperations = ref([])

function updateData() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "assemblies/operations/" + props.assembly_name)
        .then((jsonRes) => {
            return jsonRes.json();
        })
        .then((jsonRes) => {
            assemblyOperations.value = jsonRes;
            // console.log(jsonRes);
        });
}

watch(props, () => {
  updateData();
});

onMounted(() => {
  updateData();
});
</script>

<template>
  <router-view />
</template>