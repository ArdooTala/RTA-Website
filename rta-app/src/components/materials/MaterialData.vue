<template>
    <div class="col-12">
        <div class="mb-2 py-5 border-bottom border-top">
            <p class="text-center display-2">{{ material_data.name }}</p>
        </div>
        <div class="col-12 col-lg-8 border-bottom mb-3 mx-auto">
            <p class="text-center mb-0">TYPE:</p>
            <p class="display-6 text-center">
                {{ material_data.type }}
            </p>

            <div class="fw-lighter">
                <!-- <p class=" mb-0">Height: {{ material_data.beam_height || "-" }}</p>
                <p class=" mb-0">Lap Joints: {{ material_data.lap_joints || "-" }}</p>
                <p class=" mb-0">Number of Crosses: {{ material_data.crosses || "-" }}</p> -->
                <p class=" mb-0">ID#: {{ material_data.id_number || "-" }}</p>
            </div>


        </div>

        <div class="col-12 col-lg-8 border-bottom mb-5 mx-auto">
            <div class="input-group input-group-sm mb-2">
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
                :disabled="!selection_is_valid" @click="addRecord">
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
                            <div class="d-flex">
                                <router-link :to="'/mps/' + record.part_name" type="button"
                                    class="btn btn-dark border flex-fill disabled">Open in Dashboard</router-link>

                                <button type="button" class="btn btn-danger ms-2" data-bs-toggle="modal"
                                    :data-bs-target="'#deleteModal'+record.part_name">
                                    <i class="bi bi-trash3"></i>
                                </button>

                                <div class="modal fade" :id="'deleteModal'+record.part_name" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Are you sure you want to
                                                    delete this record?</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="text-center">
                                                    <p class="display-6">{{ record.part_name }}</p>
                                                    <p>WILL BE DELETED FROM</p>
                                                    <p class="display-6">{{ material_data.name }}</p>
                                                </div>
                                            </div>
                                            <div class="modal-footer d-flex">
                                                <button type="button" class="btn btn-secondary flex-fill" data-bs-dismiss="modal">
                                                    No
                                                </button>
                                                <button type="button" class="btn btn-danger" data-bs-toggle="modal"
                                                    :data-bs-target="'#confirmDeleteModal'+record.part_name">
                                                    Yes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal fade" :id="'confirmDeleteModal'+record.part_name" tabindex="-1">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h1 class="modal-title fs-5" id="exampleModalLabel">Are you f**king sure?</h1>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                            </div>
                                            <div class="modal-body">
                                                <div class="text-center">
                                                    <p class="display-6">{{ material_data.name }}</p>
                                                    <p>IS NOT USED IN</p>
                                                    <p class="display-6">{{ record.part_name }}</p>
                                                </div>
                                            </div>
                                            <div class="modal-footer d-flex">
                                                <button type="button" class="btn btn-secondary flex-fill" data-bs-dismiss="modal">
                                                    No
                                                </button>
                                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="(e) => deleteRecord(record.part_name)">
                                                    Sure
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps(["material_data"]);
const newRecPart1 = ref("");
const newRecPart2 = ref("");
const newRecPart3 = ref("");

const selection_is_valid = computed(() => {
    if (newRecPart1.value.length <= 0) return false;
    if (newRecPart2.value.length <= 0) return false;
    if (newRecPart3.value.length <= 0) return false;

    return true;
});

const emit_refresh = defineEmits(["added-to-db"])

function addRecord() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "records/material_record/",
        {
            method: "POST",
            body: JSON.stringify({
                part_name: newRecPart1.value + "-" + String(newRecPart2.value).padStart(2, '0') + "-" + String(newRecPart3.value).padStart(2, '0'),
                timestamp: new Date(),
                assembly: "ManualEntry",
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

function deleteRecord(pname) {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "records/material_record/",
        {
            method: "DELETE",
            body: JSON.stringify({
                part_name: pname,
                block_name: props.material_data.name
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        // .then((json) => newRecPart3.value = "")
        .then(() => emit_refresh('added-to-db'));
}
</script>