<template>
    <div class="col-12 col-md-6 col-lg-4">
        <div class="mb-2 py-5 border-bottom border-top">
            <p class="text-center display-2">{{ material_data.name }}</p>
        </div>
        <div class="col-12 col-lg-8 border-bottom mb-3 mx-auto">
            <p class="text-center mb-0">TYPE:</p>
            <p class="display-6 text-center">
                {{ material_data.type }}
            </p>

            <div class="fw-lighter">
                <p class=" mb-0">Height: {{ material_data.beam_height || "-" }}</p>
                <p class=" mb-0">Lap Joints: {{ material_data.lap_joints || "-" }}</p>
                <p class=" mb-0">Number of Crosses: {{ material_data.crosses || "-" }}</p>
                <p class=" mb-0">ID#: {{ material_data.id_number || "-" }}</p>
            </div>


        </div>

        <div class="col-12 col-lg-8 border-bottom mb-5 mx-auto">
            <div class="input-group input-group-sm">
                <!-- <input type="text" class="form-control" list="datalistOptions" v-model="newRecAssm"
                    placeholder="Assembly Name" /> -->
                <input type="text" class="form-control" v-model="newRecPart1" placeholder="PSM01" />
                <span class="input-group-text">-</span>
                <input type="number" class="form-control" v-model="newRecPart2" placeholder="00" />
                <span class="input-group-text">-</span>
                <input type="number" class="form-control" v-model="newRecPart3" placeholder="00" />
                <!-- <input type="text" class="form-control" list="datalistOptions" v-model="newRecPart"
                    placeholder="Part Name" /> -->
                <!-- <datalist id="datalistOptions">
                    <option v-for="blk_type in blk_types" :value="blk_type._id" />
                </datalist> -->
            </div>

            <button class="btn btn-outline-secondary mb-3 w-100" type="button" id="button-addon3"
                :disabled="newRecPart3.length <= 0" @click="addRecord">
                Add Record
            </button>

            <p class="text-center mb-0">Records:</p>

            <div class="accordion accordion-flush border-bottom border-top overflow-hidden" id="materialsAccordion">
                <div v-for="record in material_data.records" class="accordion-item bg-transparent">
                    <div class="accordion-header justify-content-between">
                        <button type="button" class="btn w-100 me-auto d-flex align-items-center" data-bs-toggle="collapse"
                            :data-bs-target="'#' + record._id">
                            <p class="my-0">{{ record.part_name }}</p>
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
</template>

<script setup>
import { ref, defineProps } from "vue";

const props = defineProps(["material_data"]);
const newRecPart1 = ref("PSM01");
const newRecPart2 = ref("01");
const newRecPart3 = ref("");

const emit_refresh = defineEmits(["added-to-db"])

function addRecord() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "records/material_record/",
        {
            method: "POST",
            body: JSON.stringify({
                part_name: newRecPart1.value + "-" + String(newRecPart2.value).padStart(2, '0') + "-" + String(newRecPart3.value).padStart(2, '0'),
                timestamp: new Date(),
                assembly: "First",
                block_name: props.material_data.name
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((json) => newRecPart3.value = "")
        .then(() => emit_refresh('added-to-db'));
}
</script>