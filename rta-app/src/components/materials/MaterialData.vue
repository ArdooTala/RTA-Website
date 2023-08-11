<template>
    <div class="col-12 col-md-6 col-lg-4">

        <p class="text-center py-5 mb-0 display-2 border-bottom border-top">{{ material_data.name }}</p>
        <div class="mb-5">
            <div class="fw-lighter">
                <p>ID - {{ material_data._id }}</p>
                <p>Type: {{ material_data.type }}</p>
            </div>
        </div>

        <p class="text-center ">Records:</p>

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
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps(["material_data"]);

</script>