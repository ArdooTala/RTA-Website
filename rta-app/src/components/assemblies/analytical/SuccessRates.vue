<template>
  <v-chart class="chart" :option="option" autoresize />
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
import { ref, provide, onMounted, watch, computed } from "vue";

const props = defineProps(["assembly_name"]);

const OP_NAMES = { 0: "PICKING", 1: "PLACING", 2: "LOADING", 3: "SCREWING" };

function updateData() {
  fetch("http://localhost:5000/assemblies/success_rate/" + props.assembly_name)
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      console.log(jsonRes);
      return jsonRes.map((x) => {
        return {
          name: OP_NAMES[x._id],
          value: Math.round(
            (Number(x.success_count) / Number(x.ops_count)) * 100
          ),
        };
      });
    })
    .then((jsonRes) => {
      option.value.series[0].data = jsonRes;
      console.log(jsonRes);
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
    text: "OPERATIONS SUCCESS RATE",
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
      roundCap: true,
      itemStyle: {},
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
</script>

<style scoped>
/* .chart {
  height: 100px;
} */
</style>