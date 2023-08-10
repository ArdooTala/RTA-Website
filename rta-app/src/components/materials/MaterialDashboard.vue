<script setup>
import { ref, defineProps, watch } from "vue";
import { useRoute } from "vue-router";

// const route = useRoute();
const props = defineProps(["material_name"]);
const materials_data = ref([]);
const found = ref(true);
const write_res = ref(true);

function addToDB() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "materials/",
        {
            method: "POST",
            body: JSON.stringify({
                name: props.material_name,
                type: props.material_name.split('-')[0],
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(() => updateData());
}

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
                <div class="col-12 col-md-6 col-lg-4" v-for="material_data in materials_data">

                    <p class="text-center py-5 display-2 border-bottom border-top">{{ material_data.name }}</p>
                    <div class="">
                        <p>Type: {{ material_data.type }}</p>
                        <p>Database ID: {{ material_data._id }}</p>
                    </div>

                    <p class="border-bottom ">Records:</p>

                    <div class="accordion accordion-flush overflow-hidden" id="materialsAccordion">
                        <div v-for="record in material_data.records"
                            class="accordion-item border-bottom bg-transparent">
                            <div class="accordion-header justify-content-between">
                                <button type="button" class="btn w-100 me-auto d-flex align-items-center"
                                    data-bs-toggle="collapse" :data-bs-target="'#' + record._id">
                                    <p class="">{{ record.part_name }}</p>
                                </button>
                            </div>

                            <div :id="record._id" class="accordion-collapse collapse bg-transparent"
                                data-bs-parent="#materialsAccordion">
                                <div class="accordion-body">
                                    <p>Assembly: {{ record.assembly }}</p>
                                    <p>Timestamp: {{ new Date(record.timestamp).toLocaleString() }}</p>
                                    <router-link :to="'/mps/' + record.part_name" type="button"
                                        class="btn btn-dark border w-100 mt-4 disabled">Open in Dashboard</router-link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div v-else class="col-12 d-flex justify-content-center">
                <div class="col-12 col-lg-8">
                    <p class="text-center py-5 display-2 border-bottom border-top">{{ material_name }}</p>
                    <button class="btn btn-dark border w-100 mb-2" type="button" @click="addToDB">
                        ADD TO DATABASE
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
