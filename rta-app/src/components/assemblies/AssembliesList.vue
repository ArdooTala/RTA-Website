<script>
import AssemblyCard from "./AssemblyCard.vue";
import EcosystemIcon from "../icons/IconEcosystem.vue";
import { RouterLink, RouterView } from "vue-router";

export default {
  data() {
    return {
      assemblies: [],
    };
  },
  mounted() {
    fetch("http://localhost:5000/assemblies")
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
    AssemblyCard,
  },
};
</script>

<template>
  <div class="mt-2">
    <button
      class="btn btn-dark dropdown-toggle border w-100 mt-2 d-block d-md-none"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#assembliesCollapseTarget"
    >
      ASSEMBLIES
    </button>
    <div class="collapse show" id="assembliesCollapseTarget">
      <div
        class="accordion accordion-flush overflow-hidden"
        id="assembliesAccordion"
      >
        <div
          v-for="ass in assemblies"
          class="accordion-item p-2 border-bottom bg-transparent"
        >
          <div class="accordion-header justify-content-between">
            <button
              type="button"
              class="btn w-100 me-auto d-flex align-items-center"
              data-bs-toggle="collapse"
              :data-bs-target="'#' + ass._id"
            >
              <!-- <EcosystemIcon class="me-2" /> -->
              <h5 class="p-2 m-0 me-auto">{{ ass._id }}</h5>
              <span class="badge rounded-pill text-bg-light">{{
                ass.count
              }}</span>
            </button>
          </div>

          <div
            :id="ass._id"
            class="accordion-collapse collapse bg-transparent"
            data-bs-parent="#assembliesAccordion"
          >
            <div class="accordion-body">
              <AssemblyCard class="">
                <template #icon><EcosystemIcon /></template>
                <template #start>{{ ass._id }}</template>
                <template #end>{{ ass._id }}</template>
                <template #parts_count>{{ ass.count }}</template>
              </AssemblyCard>

              <router-link
                :to="'/assemblies/' + ass._id"
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
