<script setup>
import AssemblyOperationCard from "./AssembledPartCard.vue";
import AssembledPartCard from "./AssembledPartCard.vue";
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
            data-bs-target="#assembledPartsCollapseTarget">
            ASSEMBLED PARTS
        </button>

        <div class="collapse show" id="assembledPartsCollapseTarget">
            <div class="accordion accordion-flush overflow-hidden" id="assembliesAccordion">
                <div v-for="assedPart in assemblyOperations" class="accordion-item p-2 border-bottom bg-transparent">
                    <div class="accordion-header justify-content-between">
                        <button type="button" class="btn w-100 me-auto d-flex align-items-center" data-bs-toggle="collapse"
                            :data-bs-target="'#' + assedPart._id">
                            <h6 class="p-2 m-0 me-auto">
                                {{ assedPart._id }}
                            </h6>
                            <span class="badge rounded-pill text-bg-light">{{ assedPart.count }}</span>
                        </button>
                    </div>

                    <div :id="assedPart._id" class="accordion-collapse collapse bg-transparent"
                        data-bs-parent="#assembliesAccordion">
                        <div class="accordion-body">
                            <AssembledPartCard class="" :assed-part="assedPart">
                            </AssembledPartCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
