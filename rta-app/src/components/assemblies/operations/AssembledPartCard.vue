<script setup>
import AssemblyOperationsList from './AssemblyOperationsList.vue';
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";

const props = defineProps(["assedPart"])
</script>

<template>
    <div class="row">

        <div class="col-12 row">
            <div class="col-3">
                <p>Time</p>
            </div>
            <div class="col-9 d-flex justify-content-between">
                {{ assedPart.operations[0].start_time }}
                <p> - </p>
                {{ assedPart.operations[assedPart.operations.length-1].end_time }}
            </div>

            <div class="col-3">
                <p>Ops Count</p>
            </div>
            <div class="col-9">
                {{ assedPart.operations.length }}
            </div>

            <div class="col-12">
                <AssemblyOperationsList :assembly_operations="assedPart.operations"/>
            </div>

        </div>
    </div>
</template>