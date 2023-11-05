<script setup>
import AssemblyOperationCard from "./AssemblyOperationCard.vue";
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";


const props = defineProps(["assembly_name"])
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
    <div class="">
        <button class="btn btn-dark dropdown-toggle border w-100 mt-2 " type="button" data-bs-toggle="collapse"
            data-bs-target="#assemblyOpsCollapseTarget">
            OPERATIONS
        </button>

        <div class="collapse hide" id="assemblyOpsCollapseTarget">
            <div class="accordion accordion-flush overflow-hidden" id="assembliesAccordion">
                <div v-for="assOp in assemblyOperations" class="accordion-item p-2 border-bottom bg-transparent">
                    <div class="accordion-header justify-content-between">
                        <button type="button" class="btn w-100 me-auto d-flex align-items-center" data-bs-toggle="collapse"
                            :data-bs-target="'#' + assOp._id">
                            <h6 class="p-2 m-0 me-auto">
                                {{ assOp.operation.part_name }} -
                                {{ assOp.operation.type }}
                                [{{ assOp.result }}]
                            </h6>
                            <span class="badge rounded-pill text-bg-light">{{ assOp.count }}</span>
                        </button>
                    </div>

                    <div :id="assOp._id" class="accordion-collapse collapse bg-transparent"
                        data-bs-parent="#assembliesAccordion">
                        <div class="accordion-body">
                            <AssemblyOperationCard class="">
                                <template #start>{{ assOp.start_time }}</template>
                                <template #end>{{ assOp.end_time }}</template>
                                <template #reports>{{ assOp.reports }}</template>
                            </AssemblyOperationCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
