<script setup>
import AssemblyOperationCard from "./AssemblyOperationCard.vue";
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";

const OP_NAMES = { 0: "Picking", 1: "Placing", 2: "Screw Loading", 3: "Screwing", 8: "Home" };
const props = defineProps(["assembly_name", "assembly_operations"])

</script>

<template>
    <div class="accordion accordion-flush overflow-hidden" id="assembliesAccordion">
        <div v-for="assOp in assembly_operations" class="accordion-item p-2 border-bottom bg-transparent">
            <div class="accordion-header justify-content-between">
                <button type="button" class="btn w-100 me-auto d-flex align-items-center" data-bs-toggle="collapse"
                    :data-bs-target="'#' + assOp._id">
                    <div class="p-1 m-0 me-auto d-flex justify-content-between w-100">
                        <div>
                            <i v-show="assOp.operation.type == '0'" class="bi bi-box-arrow-up"></i>
                            <i v-show="assOp.operation.type == '1'" class="bi bi-box-arrow-down"></i>
                            <i v-show="assOp.operation.type == '2'" class="bi bi-nut"></i>
                            <i v-show="assOp.operation.type == '3'" class="bi bi-screwdriver"></i>
                            <i v-show="assOp.operation.type == '8'" class="bi bi-house"></i>
                        </div>
<div>
    {{ OP_NAMES[assOp.operation.type] }}
</div>
                        <div>
                            <i v-show="assOp.result == 'sm_succeeded'" class="bi bi-check-lg"></i>
                            <i v-show="assOp.result == 'sm_recovered'" class="bi bi-arrow-counterclockwise"></i>
                            <i v-show="assOp.result == 'sm_aborted'" class="bi bi-x-lg"></i>
                        </div>
                    </div>
                    <span class="badge rounded-pill text-bg-light">{{ assOp.count }}</span>
                </button>
            </div>

            <div :id="assOp._id" class="accordion-collapse collapse bg-transparent" data-bs-parent="#assembliesAccordion">
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
</template>
