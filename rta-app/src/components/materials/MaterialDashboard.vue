<script setup>
import { ref, defineProps, watch } from "vue";
import { useRoute } from "vue-router";

import MaterialData from './MaterialData.vue'
import MaterialAdd from './MaterialAdd.vue'

// const route = useRoute();
const props = defineProps(["material_name"]);
const materials_data = ref([]);
const found = ref(true);

function updateData() {
    fetch(
        import.meta.env.VITE_BACKEND_BASE_URL +
        "materials/" +
        props.material_name
    )
        .then((jsonRes) => {
            return jsonRes.json();
        })
        .then((jsonRes) => {
            found.value = (jsonRes.length > 0);
            materials_data.value = jsonRes;
        });
}

updateData();

watch(props, () => {
    updateData();
});
</script>

<template>
    <div class="row h-100 d-flex align-items-center justify-content-center" id="material_dashboard">
        <div class="col-12 row">
            <div v-if="found" class="col-12 d-flex justify-content-center">
                <MaterialData v-for="material_data in materials_data" :material_data="material_data"/>
            </div>
            <div v-else class="col-12 d-flex justify-content-center">
                <MaterialAdd :material_name="material_name" @added-to-db="updateData"/>
                <!-- <div class="col-12 col-lg-8">
                    <p class="text-center py-5 display-2 border-bottom border-top">{{ material_name }}</p>
                    <button class="btn btn-dark border w-100 mb-2" type="button" @click="addToDB">
                        ADD TO DATABASE
                    </button>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped></style>
