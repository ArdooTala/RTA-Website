<template>
    <div class="col-12 col-lg-8">
        <p class="text-center py-5 display-2 border-bottom border-top">{{ material_name }}</p>
        <button class="btn btn-dark border w-100 mb-2" type="button" @click="addToDB">
            ADD TO DATABASE
        </button>
    </div>
</template>

<script setup>
// import { ref, defineProps, watch } from "vue";

const props = defineProps(["material_name"]);
const emit_refresh = defineEmits(["added-to-db"])
function addToDB() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "materials/",
        {
            method: "POST",
            body: JSON.stringify({
                name: props.material_name,
                type: props.material_name.split('-')[0],
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((json) => console.log(json))
        .then(() => emit_refresh('added-to-db'));
}
</script>