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
  <div
    class="accordion accordion-flush rounded-4 overflow-hidden"
    id="accordionExample"
    data-bs-theme="dark"
  >
    <div v-for="ass in assemblies" class="accordion-item p-2 border-bottom">
      <div class="accordion-header justify-content-between">
        <div class="btn-group w-100 justify-content-between">
          <button
            type="button"
            class="btn w-75 me-auto d-flex align-items-center"
          >
            <EcosystemIcon class="me-2" />
            <h5 class="p-2 m-0 me-auto">{{ ass._id }}</h5>
            <span class="badge rounded-pill text-bg-light">{{
              ass.count
            }}</span>
          </button>

          <button
            class="btn dropdown-toggle dropdown-toggle-split ms-1"
            type="button"
            data-bs-toggle="collapse"
            :data-bs-target="'#' + ass._id"
            aria-expanded="false"
            :aria-controls="ass._id"
          ></button>
        </div>
      </div>

      <div
        :id="ass._id"
        class="accordion-collapse collapse bg-transparent"
        data-bs-parent="#accordionExample"
      >
        <div class="accordion-body bg-transparent">
          <AssemblyCard class="">
            <template #icon><EcosystemIcon /></template>
            <template #start>{{ ass._id }}</template>
            <template #end>{{ ass._id }}</template>
            <template #parts_count>{{ ass.count }}</template>
          </AssemblyCard>

          <router-link :to="'/assemblies/' + ass._id" type="button" class="btn btn-dark border">Open in Dashboard</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
