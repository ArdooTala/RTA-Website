<template>
  <div class="row d-flex flex-column">
    <div class="ratio ratio-1x1">
      <v-chart class="chart" :option="optionScatter" autoresize />
    </div>
    <div class="ratio ratio-4x3">
      <v-chart class="chart" :option="optionHistogram" autoresize />
    </div>
    <div class="mt-auto">
      <p>Error Range: [{{ Math.min(...holeDist).toFixed(2) }} mm ~ {{ Math.max(...holeDist).toFixed(2) }} mm]</p>
      <p>Average Error: {{ (holeDist.reduce((a, b) => a + b, 0) / holeDist.length).toFixed(2) }} mm</p>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer, CanvasRenderer } from "echarts/renderers";
import { BarChart, HeatmapChart, ScatterChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
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
        return p.report
          .split(",")
          .slice(0, 2)
          .map(Number)
          .map(x => x * 1000)
          .concat(p.assembly);
      })
        .filter(x => !x.slice(0, 2).some(y => Number.isNaN(y)));
    })
    .then((jsonRes) => {
      optionScatter.value.series[0].data = jsonRes;
      hole_errors.value = jsonRes;
    });
}

// const gridSize = computed(() => {
//   let gridRange = [
//     Math.floor(hole_errors.value.reduce((m, x) => Math.min(
//       x[0], x[1], m), 0)),
//     Math.ceil(hole_errors.value.reduce((m, x) => Math.max(
//       x[0], x[1], m), 1)),
//   ];
//   console.log(gridRange);
//   return gridRange;
// });

const hmRange = computed(() => {
  // let hmRng =  Array.from(new Array(gridSize.value[1] - gridSize.value[0]), (x, i) => `${i - Math.abs(gridSize.value[0])}`);
  let hmRng =  Array.from(new Array(40), (x, i) => `${i - 20}`);
  return hmRng
});

const holeDist = computed(() => {
  return hole_errors.value.map(
    (x) => Math.sqrt(x[0] * x[0] + x[1] * x[1])
  );
});

const histogramVals = computed(() => {
  let hist = histogram({
    data: holeDist.value,
    bins: 10
  });
  return hist.map((x) => [(x.reduce((a, b) => a + b, 0) / x.length).toFixed(), x.length]);
});

const heatmapVals = computed(() => {
  let grouped = hole_errors.value.reduce(
    (entryMap, e) =>
      entryMap.set(
        Math.floor(e[0]).toString() + '+' + Math.floor(e[1]).toString(),
        (entryMap.get(Math.floor(e[0]).toString() + '+' + Math.floor(e[1]).toString()) || 0) + 1
      ),
    new Map()
  );
  let hmVals = Array.from(grouped.entries()).map(x => [...x[0].split('+'), x[1]]);
  console.log(hmVals);

  return hmVals;
});

// ECharts Setup
use([
  CanvasRenderer,
  ScatterChart,
  BarChart,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
]);
provide(THEME_KEY, "dark");

// Get data and draw the chart
const optionScatter = ref({
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: "HOLES OFFSET",
    left: "left",
  },
  tooltip: {
    trigger: "item",
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
      xAxisIndex: [0, 1],
      yAxisIndex: [0, 1],
      filterMode: 'empty',
    },
  ],
  xAxis: [
    {
      type: 'value',
      min: -20, //gridSize[0],
      max: 20,  //gridSize[1],
      // interval: 5,
      // boundaryGap: ["10%", "10%"],
    },
    {
      type: 'category',
      data: hmRange,
      show: false,
    }
  ],
  yAxis: [
    {
      type: 'value',
      min: -20, //gridSize[0],
      max: 20,  //gridSize[1],
      // interval: 5,
      // boundaryGap: ["10%", "10%"],
    },
    {
      type: 'category',
      data: hmRange,
      show: false,
    },
  ],
  // visualMap: {
  //   min: 0,
  //   max: 10,// Math.max(...(heatmapVals.map(x => x[2]))),
  //   calculable: true,
  //   orient: 'horizontal',
  //   left: 'center',
  //   bottom: '15%',
  //   inRange: {
  //     opacity: [0, 0.8],
  //   },
  // },
  series: [
    {
      type: "scatter",
      xAxisIndex: 0,
      yAxisIndex: 0,
      data: [[0, 0, 0]],
      symbolSize: 5,
      encode: {
        tooltip: 2,
      },
    },
    // {
    //   name: "Errors Heatmap",
    //   type: "heatmap",
    //   xAxisIndex: 1,
    //   yAxisIndex: 1,
    //   coordinateSystem: 'cartesian2d',
    //   data: heatmapVals,
    // },
  ],
});

// Get data and draw the chart
const optionHistogram = ref({
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
    boundaryGap: ["10%", "10%"],
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
      data: histogramVals,
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
