<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="row">
    <h1 class="col-12" style="font-size: xxx-large; font-weight: 1000;">{{ msg }}</h1>
  </div>
</template>

<!-- <style scoped>

.h1 {
  color: var(--color-heading);
  font-size: x-large;
}

</style> -->
