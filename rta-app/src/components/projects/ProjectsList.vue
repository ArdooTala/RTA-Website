<script setup>
import WelcomeItem from "./WelcomeItem.vue";
import ProjectCard from "./ProjectCard.vue";
import DocumentationIcon from "./icons/IconDocumentation.vue";
import ToolingIcon from "./icons/IconTooling.vue";
import EcosystemIcon from "./icons/IconEcosystem.vue";
import CommunityIcon from "./icons/IconCommunity.vue";
import SupportIcon from "./icons/IconSupport.vue";

import { ref } from 'vue'
const projects = ref([
    {
        heading: "Summer School 2023",
        description: "SDU CREATE Summer School 2023 Project",
        location: "SDU Campus, Odense",
        year: 2022,
        contact: "Me!",
    },
    {
        heading: "Summer School 2023",
        description: "SDU CREATE Summer School 2023 Project",
        location: "SDU Campus, Odense",
        year: 2023,
        contact: "Me!",
    },
    {
        heading: "Summer School 2023",
        description: "SDU CREATE Summer School 2023 Project",
        location: "SDU Campus, Odense",
        year: 2024,
        contact: "Me!",
    },
])
</script>

<template>
  <ul class="list-group">
    <ProjectCard v-for="prj in projects">
      <template #icon>
        <EcosystemIcon />
      </template>
      <template #heading>{{ prj.heading }}</template>
      <template #description>{{ prj.description }}</template>
      <template #location>{{ prj.location }}</template>
      <template #year>{{ prj.year }}</template>
      <template #contact>{{ prj.contact }}</template>
    </ProjectCard>
  </ul>
</template>

