<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer, CanvasRenderer } from "echarts/renderers";
import { BarChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";
import histogram from "histogramjs";

const props = defineProps(["assembly_name"]);
const hole_errors = ref([[0, 0]]);

function updateData() {
  fetch(
    import.meta.env.VITE_BACKEND_BASE_URL +
    "assemblies/hole_errors/" +
    props.assembly_name
  )
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
  let hist = histogram({
    data: dists,
    bins: 10
  });
  return hist.map((x) => [(x.reduce((a, b) => a + b, 0) / x.length).toFixed(), x.length]);
});

// ECharts Setup
use([
  CanvasRenderer,
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
    // interval: 1,
    boundaryGap: ["30%", "20%"],
  },
  yAxis: {
    type: "value",
    onZero: false,
    axisLine: {
      onZero: false,
    },
    // interval: 5,
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

let last_update = 0;
async function watchDB() {
  fetch(import.meta.env.VITE_BACKEND_BASE_URL + "lastupdate")
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      if (jsonRes.last_update != last_update.last_update) {
        last_update = jsonRes;
        // console.log(last_update, jsonRes);
        updateData();
      }
      //   console.log(last_update);
    });
}

let polling = null;
onMounted(() => {
  watchDB();
  //   updateData();
  polling = setInterval(watchDB, 3000);
});

onUnmounted(() => {
  clearInterval(polling);
});
</script>

<style scoped>
/* .chart {
    height: 100px;
  } */
</style>
