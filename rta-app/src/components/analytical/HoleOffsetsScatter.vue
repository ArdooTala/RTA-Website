<template>
  <div
    class="ratio ratio-1x1 rounded-4 bg-dark overflow-hidden"
    data-bs-theme="dark"
  >
    <div class="p-2">
      <v-chart class="chart" :option="option" autoresize />
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
  SVGRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, "dark");

const props = defineProps(['holeOffsets'])

const option = ref({
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: "HOLES OFFSET",
    left: "left",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  xAxis: {
    interval: 0.5,
    boundaryGap: ['10%', '10%']
  },
  yAxis: {
    interval: 0.5,
    boundaryGap: ['10%', '10%']
  },
  series: [
    {
      symbolSize: 10,
      data: props.holeOffsets,
      type: "scatter",
    },
  ],
});
</script>

<style scoped>
/* .chart {
    height: 100px;
  } */
</style>
