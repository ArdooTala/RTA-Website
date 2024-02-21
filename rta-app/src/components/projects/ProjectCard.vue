<template>
  <div class="row">
    <div class="col-12">
      <div v-for="p in parts">
        <table>
          <tr><td>Speckle ID</td> <td>{{ p.id }}</td> </tr>
          <tr><td>Name</td> <td>{{ p.data.PartName }}</td> </tr>
          <tr><td>Type</td> <td>{{ p.data.PartType }}</td> </tr>
          <tr><td>Bolts</td> <td>{{ p.data.BoltsGeo.length }}</td> </tr>
          <tr><td>Nuts</td> <td>{{ p.data['\\@NutsLoc']?.length }}</td> </tr>
        </table>
        ---
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";
import { RouterLink, RouterView } from "vue-router";

const props = defineProps(["project_name"])
const parts = ref([])

function updateData() {
  fetch(import.meta.env.VITE_BACKEND_BASE_URL + "clusters/" + props.project_name)
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      jsonRes = jsonRes.object.children.objects;
      return jsonRes;
    })
    .then((jsonRes) => {
      parts.value = jsonRes;
    });
}

watch(props, () => {
  updateData();
});

onMounted(() => {
  updateData();
});
</script>