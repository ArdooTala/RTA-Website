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
import { BarChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, computed } from "vue";

use([
  SVGRenderer,
  ScatterChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, "dark");

const props = defineProps(["holeOffsets"]);

const holeDist = computed(() => {
  let dists = props.holeOffsets.map((x) =>
    Math.sqrt(x[0] * x[0] + x[1] * x[1])
  );
  let grouped = dists.reduce(
    (entryMap, e) =>
      entryMap.set(Math.round(e), [...(entryMap.get(Math.round(e, 0.2)) || []), e]),
    new Map()
  );
  let histogram = Array.from(grouped.entries());
  return histogram.map((x) => [x[0], x[1].length]);
});

const option = ref({
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: "HOLES OFFSET HISTOGRAM",
    left: "left",
  },
  tooltip: {
    trigger: "item",
    formatter: "Distance~{c} Holes",
  },
  xAxis: {
    type: "value",
    interval: 1,
    boundaryGap: ['30%', '20%']
  },
  yAxis: {
    type: "value",
    onZero: false,
    axisLine: {
      onZero: false
    },
    interval: 5
  },
  series: [
    {
      data: holeDist,
      type: "bar",
      showBackground: false,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)",
      },
    },
  ],
});
</script>

<style scoped>
/* .chart {
    height: 100px;
  } */
</style>
