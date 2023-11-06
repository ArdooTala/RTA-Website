<template>
  <div class="row">
    <!-- <div class="col-6">
      <p class="" v-for="wl in wlReport">{{ wl.name }}: {{ wl.value }} Ops</p>
    </div> -->
    <div class="col-12">
      <div class="ratio ratio-1x1" style="--bs-aspect-ratio: 50%;">
        <v-chart class="chart" :option="option" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
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
      option.value.series[0].data = jsonRes;
      wlReport.value = jsonRes;
    });
}

const wlReport = ref();

// ECharts Setup
use([SVGRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);
provide(THEME_KEY, "dark");

// Get data and draw the chart
const option = ref({
  backgroundColor: "rgba(0,0,0,0)",
  title: {
    text: "WORKLOAD",
    left: "left",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    left: "left",
    top: "bottom",
  },
  series: [
    {
      name: "# of parts assembled",
      type: "pie",
      radius: ["30%", "60%"],
      center: ["50%", "50%"],
      itemStyle: {
        borderRadius: 5,
      },
      data: [{ name: "", value: 0 }],
      label: {
        show: true,
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
