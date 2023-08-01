<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer, CanvasRenderer } from "echarts/renderers";
import { ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";

const props = defineProps(["assembly_name"]);

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
        return p.report
          .split(",")
          .slice(0, 2)
          .map(Number)
          .map((x) => x * 1000)
          .concat(p.assembly);
      });
    })
    .then((jsonRes) => {
      option.value.series[0].data = jsonRes;
      //   console.log(jsonRes);
    });
}

// ECharts Setup
use([
  CanvasRenderer,
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
    // interval: 0.5,
    boundaryGap: ["10%", "10%"],
  },
  yAxis: {
    // interval: 0.5,
    boundaryGap: ["10%", "10%"],
  },
  series: [
    {
      symbolSize: 10,
      data: [[0, 0, 0]],
      type: "scatter",
      encode: {
        x: 0,
        y: 1,
        tooltip: 2,
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
