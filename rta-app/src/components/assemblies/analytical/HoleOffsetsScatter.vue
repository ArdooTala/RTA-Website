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
import { ref, provide, onMounted, watch, computed } from "vue";

const props = defineProps(["assembly_name", "holeOffsets"]);

function updateData() {
  fetch("http://localhost:5000/assemblies/hole_errors/" + props.assembly_name)
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      console.log(jsonRes);
      return jsonRes.map((p) => {
        return p.report.split(",").slice(0, 2).map(Number).concat(p.assembly);
      });
    })
    .then((jsonRes) => {
      option.value.series[0].data = jsonRes;
      console.log(jsonRes);
    });
}

// ECharts Setup
use([
  SVGRenderer,
  ScatterChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
provide(THEME_KEY, "dark");

// Get data and draw the chart
const option = ref({
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: "HOLES OFFSET",
    left: "left",
  },
  tooltip: {
    trigger: "item",
  },
  xAxis: {
    interval: 0.5,
    boundaryGap: ["10%", "10%"],
  },
  yAxis: {
    interval: 0.5,
    boundaryGap: ["10%", "10%"],
  },
  series: [
    {
      symbolSize: 10,
      data: props.holeOffsets,
      type: "scatter",
      encode: {
        x: 0,
        y: 1,
        tooltip: 2
      }
    },
  ],
});

updateData();

watch(props, () => {
  updateData();
});
</script>

<style scoped>
/* .chart {
    height: 100px;
  } */
</style>
