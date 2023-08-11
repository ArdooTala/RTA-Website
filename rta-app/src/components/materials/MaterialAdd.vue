<template>
    <div class="col-12 col-lg-8">
        <div class="mb-2 py-5 border-bottom border-top">
            <p class="text-center display-2">{{ material_name }}</p>
            <p class="text-center mb-0">Not Found</p>
        </div>
        <div class="col-12 col-lg-8 border-bottom mb-5">
            <p class="text-center mb-0">TYPE:</p>
            <p class="display-6 text-center">
                {{ block_type }}
            </p>
        </div>
        <div class="col-12 col-lg-8">
            <label class="form-label">Height</label>
            <div class="btn-group w-100 mb-3" role="group">
                <input type="radio" class="btn-check" name="beam-type" id="beam-tall" value="T" autocomplete="off"
                    v-model="beam_height">
                <label class="btn btn-outline-dark" for="beam-tall">TALL</label>

                <input type="radio" class="btn-check" name="beam-type" id="beam-short" value="S" autocomplete="off"
                    v-model="beam_height">
                <label class="btn btn-outline-dark" for="beam-short">SHORT</label>
            </div>

            <label class="form-label">Lap Joint</label>
            <div class="btn-group w-100 mb-3" role="group" id="lap-joint-btn-group">
                <input type="radio" class="btn-check" name="lap-joint-type" id="nj" value="NJ" autocomplete="off"
                    v-model="lap_joint_type">
                <label class="btn btn-sm btn-outline-dark" for="nj">NONE</label>

                <input type="radio" class="btn-check" name="lap-joint-type" id="lb" value="LB" autocomplete="off"
                    v-model="lap_joint_type">
                <label class="btn btn-sm btn-outline-dark" for="lb">BOTH</label>

                <input type="radio" class="btn-check" name="lap-joint-type" id="lp" value="LP" autocomplete="off"
                    v-model="lap_joint_type">
                <label class="btn btn-sm btn-outline-dark" for="lp">POSITIVE</label>

                <input type="radio" class="btn-check" name="lap-joint-type" id="ln" value="LN" autocomplete="off"
                    v-model="lap_joint_type">
                <label class="btn btn-sm btn-outline-dark" for="ln">NEGATIVE</label>
            </div>

            <div class="row">
                <div class="col mb-3">
                    <label for="crosses-count" class="form-label">Crosses</label>
                    <input type="number" class="form-control" id="crosses-count" placeholder="0" v-model="crosses_count">
                </div>

                <div class="col mb-3">
                    <label for="block-number" class="form-label">Number</label>
                    <input type="number" class="form-control" id="block-number" placeholder="000" v-model="block_number">
                </div>
            </div>


            <button class="btn btn-dark border w-100 mt-5" type="button" @click="addToDB" :disabled="!selection_is_valid">
                ADD TO DATABASE
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps(["material_name"]);
const beam_height = ref("");
const lap_joint_type = ref("");
const crosses_count = ref(0);
const block_number = ref(0);

const block_type = computed(() => {
    return 'B' +
        (beam_height.value || "*") +
        (lap_joint_type.value || "**") +
        '_' +
        String(crosses_count.value).padStart(2, '0') +
        '-' +
        String(block_number.value).padStart(3, '0')
})
const selection_is_valid = computed(() => {
    if (beam_height.value == "") return false;
    if (lap_joint_type.value == "") return false;
    if (crosses_count.value == 0) return false;
    // if (!block_number.value == 0) return false;
    return true;
});

const emit_refresh = defineEmits(["added-to-db"])

function addToDB() {
    fetch(import.meta.env.VITE_BACKEND_BASE_URL + "materials/",
        {
            method: "POST",
            body: JSON.stringify({
                name: props.material_name,
                type: block_type.value,
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