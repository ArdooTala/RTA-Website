<template>
    <v-chart class="chart" :option="option" autoresize />
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
import { ref, provide, onMounted, watch, computed } from "vue";

const props = defineProps(["assembly_name"]);
const hole_errors = ref([[0, 0]]);

function updateData() {
  fetch("http://localhost:5000/assemblies/hole_errors/" + props.assembly_name)
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      //   console.log(jsonRes);
      return jsonRes.map((p) => {
        return p.report.split(",").slice(0, 2).map(Number);
      });
    })
    .then((jsonRes) => {
      hole_errors.value = jsonRes;
      //   console.log(jsonRes);
    });
}

const holeDist = computed(() => {
  let dists = hole_errors.value.map(
    (x) => Math.sqrt(x[0] * x[0] + x[1] * x[1]) * 1000
  );
  let grouped = dists.reduce(
    (entryMap, e) =>
      entryMap.set(Math.round(e), [
        // ...(entryMap.get(Math.round(e, 0.2)) || []),
        ...(entryMap.get(Math.round(e)) || []),
        e,
      ]),
    new Map()
  );
  let histogram = Array.from(grouped.entries());
  return histogram.map((x) => [x[0], x[1].length]);
});

// ECharts Setup
use([
  SVGRenderer,
  ScatterChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
provide(THEME_KEY, "dark");

// Get data and draw the chart
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
    boundaryGap: ["30%", "20%"],
  },
  yAxis: {
    type: "value",
    onZero: false,
    axisLine: {
      onZero: false,
    },
    interval: 5,
  },
  series: [
    {
      data: holeDist,
      type: "bar",
      showBackground: false,
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)",
      },
      itemStyle: {
        borderRadius: 5,
      },
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
