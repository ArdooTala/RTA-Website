<template>
  <div class="ratio ratio-1x1">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PolarComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, onMounted, watch, computed, onUnmounted } from "vue";

const props = defineProps(["assembly_name"]);

const OP_NAMES = { 0: "PICKING", 1: "PLACING", 2: "LOADING", 3: "SCREWING" };

function updateData() {
  fetch(
    import.meta.env.VITE_BACKEND_BASE_URL +
      "assemblies/parts_success_rate/" +
      props.assembly_name
  )
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      return jsonRes.map((x) => {
        return {
          name: x._id,
          value: Math.round(
            (Number(x.success_count) / Number(x.ops_count)) * 100
          ),
        };
      });
    })
    .then((jsonRes) => {
      option.value.series[0].data = jsonRes;
    });
}

// ECharts Setup
use([
  CanvasRenderer,
  BarChart,
  PieChart,
  PolarComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
provide(THEME_KEY, "dark");

// Get data and draw the chart
const option = ref({
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: "PARTS SUCCESS RATE",
    left: "left",
  },
  legend: {
    orient: "vertical",
    left: "left",
    top: "bottom",
  },
  tooltip: {
    trigger: "item",
  },
  angleAxis: {
    max: 100,
    startAngle: 90,
    splitLine: {
      show: true,
    },
  },

  radiusAxis: {
    type: "category",
    // data: ["PICKING", "PLACING", "LOADING", "SCREWING"],
    z: 10,
  },

  polar: {
    radius: ["30%", "60%"],
  },

  series: [
    {
      type: "bar",
      data: [],
      coordinateSystem: "polar",
      //   roundCap: true,
      itemStyle: {
        borderRadius: 5,
      },
      barGap: "40%",
    },
    // {
    //   type: "pie",
    //   radius: ["0%", "40%"],
    //   itemStyle: {
    //     borderRadius: 5,
    //   },
    //   data: [
    //     { name: "A", value: 1 },
    //     { name: "B", value: 2 },
    //   ],
    //   label: {
    //     show: false,
    //   },
    //   emphasis: {
    //     itemStyle: {
    //       shadowBlur: 10,
    //       shadowOffsetX: 0,
    //       shadowColor: "rgba(0, 0, 0, 0.5)",
    //     },
    //   },
    // },
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
