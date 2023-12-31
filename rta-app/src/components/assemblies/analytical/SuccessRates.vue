<template>
  <div class="row">
    <div class="col-6">
      <p class="" v-for="sr in sucRate">
        {{ sr.name }}: {{ sr.succeeded }} / {{ sr.failed }} ({{ sr.value }}%)
      </p>
    </div>
    <div class="col-6">
      <div class="ratio ratio-1x1">
        <v-chart class="chart" :option="option" autoresize />
      </div>
    </div>
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

const OP_NAMES = { 0: "PICKING", 1: "PLACING", 2: "LOADING", 3: "SCREWING", 8: "HOME" };

function updateData() {
  fetch(
    import.meta.env.VITE_BACKEND_BASE_URL +
    "assemblies/workloads/" +
    props.assembly_name
  )
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      jsonRes.sort((a, b) => a.count - b.count);

      return jsonRes.reverse().map((x) => {
        return { name: x._id.replaceAll("/", ""), value: x.count };
      });
    })
    .then((jsonRes) => {
      option.value.series[1].data = jsonRes;
      wlReport.value = jsonRes;
    });

  fetch(
    import.meta.env.VITE_BACKEND_BASE_URL +
    "assemblies/success_rate/" +
    props.assembly_name
  )
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      jsonRes.sort((a, b) => a._id - b._id);
      return jsonRes.map((x) => {
        return {
          name: OP_NAMES[x._id],
          value: Math.round(
            (Number(x.success_count) / Number(x.ops_count)) * 100
          ),
          succeeded: Number(x.success_count),
          failed: Number(x.ops_count),
        };
      });
    })
    .then((jsonRes) => {
      option.value.series[0].data = jsonRes.map(x => x.value);
      option.value.radiusAxis.data = jsonRes.map(x => x.name);
      sucRate.value = jsonRes;
    });
}

const sucRate = ref();
const wlReport = ref();

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
    data: [],
    z: 10,
    axisLabel: {
      color: 'white',
      
    },
  },
  legend: {
    legend: {
    orient: "vertical",
    left: "left",
    top: "middle",
  },
  },
  polar: {
    radius: ["30%", "60%"],
  },
  series: [
    {
      type: "bar",
      data: [23, 11, 88],
      radius: [0, '30%'],
      coordinateSystem: "polar",
      roundCap: true,
      itemStyle: {
        opacity: 1
      },
      showBackground: true,
    },
    {
      name: "# of parts assembled",
      type: "pie",
      radius: ["0%", "25%"],
      center: ["50%", "50%"],
      itemStyle: {
        borderRadius: 5,
      },
      data: [{ name: "", value: 0 }],
      label: {
        show: false,
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

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
        updateData();
      }
    });
}

let polling = null;
onMounted(() => {
  watchDB();
  polling = setInterval(watchDB, 3000);
});

onUnmounted(() => {
  clearInterval(polling);
});
</script>

<style scoped></style>
