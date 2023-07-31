<script setup>
// import MaterialCard from "./MaterialCard.vue";
import { RouterLink } from "vue-router";
import { ref, watch, onMounted } from "vue";

const matID = ref("");
const checkedNames = ref([]);
const mat_blocks = ref([]);
const filtered_blocks = ref([]);
const blk_types = ref([]);

// function updateData() {
//   fetch(import.meta.env.VITE_BACKEND_BASE_URL + "materials")
//     .then((jsonRes) => {
//       return jsonRes.json();
//     })
//     .then((jsonRes) => {
//       mat_blocks.value = jsonRes;
//     });
// }

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
  <div class="row mt-2">
    <div class="col-12 col-md-4">
      <div class="col">
        <div class="form-check border-bottom" v-for="blk_type in blk_types">
          <input
            class="form-check-input"
            type="checkbox"
            :id="blk_type"
            :value="blk_type._id"
            v-model="checkedNames"
          />
          <label
            class="form-check-label d-flex justify-content-between w-100"
            :for="blk_type"
          >
            <h5 class="">{{ blk_type._id }}</h5>
            <span class="badge rounded-pill text-bg-light align-self-center">
              {{ blk_type.count }}
            </span>
          </label>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-8">
      <button
        class="btn btn-dark dropdown-toggle border w-100"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#assembliesCollapseTarget"
      >
        MATERIAL BLOCKS LIST
      </button>

      <div class="collapse show" id="assembliesCollapseTarget">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="matID"
            placeholder="Tag"
          />
          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            @click=""
          >
            Search
          </button>
        </div>

        <div
          class="accordion accordion-flush overflow-hidden"
          id="assembliesAccordion"
        >
          <div
            v-for="mat_block in filtered_blocks"
            class="accordion-item p-2 border-bottom bg-transparent"
          >
            <div class="accordion-header justify-content-between">
              <button
                type="button"
                class="btn w-100 me-auto d-flex align-items-center"
                data-bs-toggle="collapse"
                :data-bs-target="'#' + mat_block._id"
              >
                <!-- <EcosystemIcon class="me-2" /> -->
                <h5 class="p-2 m-0 me-auto">{{ mat_block.name }}</h5>
                <span class="badge rounded-pill text-bg-light">
                  {{ mat_block.type }}
                </span>
              </button>
            </div>

            <div
              :id="mat_block._id"
              class="accordion-collapse collapse bg-transparent"
              data-bs-parent="#assembliesAccordion"
            >
              <div class="accordion-body">
                <p>{{ mat_block || "KIR" }}</p>
                <!-- <AssemblyCard class="">
                <template #icon><EcosystemIcon /></template>
                <template #start>{{ ass._id }}</template>
                <template #end>{{ ass._id }}</template>
                <template #parts_count>{{ ass.count }}</template>
              </AssemblyCard> -->

                <router-link
                  :to="'/mps/' + mat_block._id"
                  type="button"
                  class="btn btn-dark border w-100 mt-4"
                  >Open in Dashboard</router-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
