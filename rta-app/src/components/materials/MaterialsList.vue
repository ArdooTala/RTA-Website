<!-- <script>
// import MaterialCard from "./MaterialCard.vue";
import EcosystemIcon from "../icons/IconEcosystem.vue";
import { RouterLink, RouterView } from "vue-router";

export default {
  data() {
    return {
      assemblies: [],
      matID: "",
    };
  },
  mounted() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "assemblies")
      .then((jsonRes) => {
        return jsonRes.json();
      })
      .then((jsonRes) => {
        this.assemblies = jsonRes;
        // console.log(jsonRes);
      });
  },
  components: {
    EcosystemIcon,
    // MaterialCard,
  },
};
</script> -->

<script setup>
// import MaterialCard from "./MaterialCard.vue";
import EcosystemIcon from "../icons/IconEcosystem.vue";
import { RouterLink, RouterView } from "vue-router";
import { ref, defineProps, watch } from "vue";

const matID = ref("");
const mat_blocks = ref([]);

function updateData() {
  fetch(import.meta.env.VITE_BACKEND_BASE_URL + "materials")
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      console.log(jsonRes);
      mat_blocks.value = jsonRes;
    });
}

updateData();
</script>

<template>
  <div class="">
    <button
      class="btn btn-dark dropdown-toggle border w-100 mt-2"
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
          v-for="mat_block in mat_blocks"
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
              <span class="badge rounded-pill text-bg-light">{{
                mat_block.type
              }}</span>
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
</template>
