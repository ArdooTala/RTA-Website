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
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, onMounted, watch, computed } from "vue";

const props = defineProps(["assembly_name"]);

function updateData() {
    fetch("http://localhost:5000/assemblies/workloads/" + props.assembly_name)
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      return jsonRes.map((x) => {
        return { name: x._id.replaceAll("/", ""), value: x.count };
      });
    })
    .then((jsonRes) => {
      option.value.series[0].data = jsonRes;
    })
}

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
    orient: "horizontal",
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
      data: [
        {name: "", value: 0}
      ],
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

updateData()

watch(props, () => {
    updateData()
});
</script>

<style scoped>
/* .chart {
  height: 100px;
} */
</style>
