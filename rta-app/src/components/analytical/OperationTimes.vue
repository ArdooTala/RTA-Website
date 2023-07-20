<template>
  <div class="rounded-4 h-100 bg-dark overflow-hidden" data-bs-theme="dark">
    <div class="p-2 h-100">
      <v-chart class="chart" :option="option" />
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
  SVGRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, "dark");

const props = defineProps(["timestamps"]);

const option = ref({
  title: {
    text: "OPERATIONS DURATION",
    left: "left",
  },
  backgroundColor: "rgba(0,0,0,0)",
  xAxis: {
    type: "value",
    boundaryGap: false,
    interval: 2,
  },
  yAxis: {
    type: "time",
    boundaryGap: ["10%", "10%"],
  },
  series: [
    {
      data: props.timestamps,
      type: "line",
    },
  ],
  tooltip: {
    trigger: "item",
    formatter: "{c}",
  },
  // legend: {
  //   orient: "horizontal",
  //   left: "left",
  //   top: "bottom",
  //   data: ["Svetlana", "Mercedes"],
  // },
});
</script>

<style scoped>
/* .chart {
      height: 100px;
    } */
</style>
