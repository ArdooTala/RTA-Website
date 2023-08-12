<script setup>
import { RouterLink } from "vue-router";
import { ref, watch } from "vue";

const matID = ref("");
const typeID = ref("");
const blockID = ref("");
const checkedNames = ref([]);
const filtered_blocks = ref([]);
const blk_types = ref([]);

function getMatByTypes() {
    fetch(
        import.meta.env.VITE_BACKEND_BASE_URL +
        "materials/bytype?" +
        new URLSearchParams({
            types: checkedNames.value,
        })
    )
        .then((jsonRes) => {
            return jsonRes.json();
        })
        .then((jsonRes) => {
            //   console.log("Filtered");
            //   console.log(jsonRes);
            jsonRes.sort((a, b) => {
                if (a.name < b.name) {
                    return 1;
                }
                if (a.name > b.name) {
                    return -1;
                }
                return 0;
            })
            filtered_blocks.value = jsonRes;
        });
}

function getMatTypes() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "materials/types")
        .then((jsonRes) => {
            return jsonRes.json();
        })
        .then((jsonRes) => {
            // console.log(jsonRes);
            blk_types.value = jsonRes;
            checkedNames.value = blk_types.value.map((x) => x._id);
        });
}

getMatTypes();

getMatByTypes();
// updateData();

watch(checkedNames, () => {
    getMatByTypes();
});
</script>

<template>
    <div class="mt-2 d-block">
        <div class="row">

            <div class="col-12 col-md-4 col-lg-3">
                <button class="btn btn-dark d-md-none border w-100 mb-2" type="button" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasResponsive">
                    Filter by Type
                </button>

                <div class="offcanvas-md offcanvas-end" tabindex="-1" id="offcanvasResponsive" style="max-width: 85vw;">
                    <div class="offcanvas-header">
                        <h5 class="offcanvas-title" id="offcanvasResponsiveLabel">
                            BLOCK TYPES
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"
                            data-bs-target="#offcanvasResponsive"></button>
                    </div>

                    <div class="offcanvas-body">
                        <div class="row">
                            <div class="input-group">
                                <input type="text" class="form-control" list="datalistOptions" v-model="typeID"
                                    placeholder="Type" />
                                <datalist id="datalistOptions">
                                    <option v-for="blk_type in blk_types" :value="blk_type._id" />
                                </datalist>

                                <button class="btn btn-outline-secondary" type="button" id="button-addon3"
                                    @click="checkedNames = []">
                                    Deselect All
                                </button>
                            </div>

                            <div class="col-12">
                                <template v-for="blk_type in blk_types">
                                    <template v-if="blk_type._id.includes(typeID)">
                                        <input class="btn-check" type="checkbox" :id="blk_type._id" :value="blk_type._id"
                                            v-model="checkedNames" />
                                        <label class="btn btn-dark d-flex justify-content-between my-1" :for="blk_type._id">
                                            {{ blk_type._id }}
                                            <span class="badge rounded-pill text-bg-light align-self-center">
                                                {{ blk_type.count }}
                                            </span>
                                        </label>

                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-12 col-md-8 col-lg-9">
                <div class="input-group">
                    <input type="text" class="form-control" list="datalistBlocks" v-model="blockID"
                        placeholder="Filter by Name" />
                    <datalist id="datalistBlocks">
                        <option v-for="mat_block in filtered_blocks" :value="mat_block.name" />
                    </datalist>
                </div>

                <div class="accordion accordion-flush overflow-hidden" id="assembliesAccordion">
                    <template v-for="mat_block in filtered_blocks">
                        <template v-if="mat_block.name.includes(blockID)">
                            <div class="accordion-item p-2 border-bottom bg-transparent">
                                <div class="accordion-header justify-content-between">
                                    <button type="button" class="btn w-100 me-auto d-flex align-items-center"
                                        data-bs-toggle="collapse" :data-bs-target="'#' + mat_block._id">
                                        <h5 class="p-2 m-0 me-auto">{{ mat_block.name }}</h5>
                                        <span class="badge rounded-pill text-bg-light">
                                            {{ mat_block.type }}
                                        </span>
                                    </button>
                                </div>

                                <div :id="mat_block._id" class="accordion-collapse collapse bg-transparent"
                                    data-bs-parent="#assembliesAccordion">
                                    <div class="accordion-body">
                                        <router-link :to="'/mps/' + mat_block.name" type="button"
                                            class="btn btn-dark border w-100">Open in Dashboard</router-link>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>

        </div>

    </div>
</template>
