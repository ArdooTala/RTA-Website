<template>
    <div class="col-12 col-md-6 col-lg-4">
        <div class="mb-2 py-5 border-bottom border-top">
            <p class="text-center display-2">{{ material_data.name }}</p>
        </div>
        <div class="col-12 col-lg-8 border-bottom mb-5 mx-auto">
            <p class="text-center mb-0">TYPE:</p>
            <p class="display-6 text-center">
                {{ material_data.type }}
            </p>
        </div>

        <div class="col-12 col-lg-8 border-bottom mb-5 mx-auto">
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
import { defineProps } from "vue";

const props = defineProps(["material_data"]);

</script>