<template>
  <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import {
  LineChart,
  BarChart,
  CandlestickChart,
  BoxplotChart,
} from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch, onMounted, onUnmounted } from "vue";

const props = defineProps(["assembly_name"]);

function updateData() {
  fetch(
    import.meta.env.VITE_BACKEND_BASE_URL +
      "assemblies/timestamps/" +
      props.assembly_name
  )
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      const defaultColors = [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
      ];
      return jsonRes.map((x) => {
        let start = new Date();
        start.setTime(Date.parse(x.start_time));
        let end = new Date();
        end.setTime(Date.parse(x.end_time));
        let d_name =
          x.assembly.assembly_name +
          " - " +
          x.assembly.part_name;
        return {
          name: d_name,
          value: [start, start, start, end, end],
          groupId: x.type,
          itemStyle: {
            color: defaultColors[Number(x.type)],
            borderWidth: 1
          },
          tooltip: {
            formatter: "{b}",
          },
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
  BoxplotChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
]);
provide(THEME_KEY, "dark");

const option = ref({
  title: {
    text: "OPERATIONS TIMESTAMPS",
    left: "left",
  },
  backgroundColor: "rgba(0,0,0,0)",
  yAxis: {
    type: "category",
    axisLabel: {
      // rotate: -90,
      // interval: 0,
    },
    splitLine: {
      show: true,
    },
    inverse: true,
    scale: true,
    //   boundaryGap: false,
  },
  xAxis: {
    type: "time",
    scale: true,
    axisLabel: {
      rotate: -90,
      // interval: 0,
    },
    splitLine: {
      show: true,
    },
    // splitNumber: 20,
    //   boundaryGap: ["10%", "10%"],
  },
  tooltip: {
    // trigger: "item",
    // formatter: "{c}",
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: "none",
      },
    },
  },
  dataZoom: [
    {
      type: "inside",
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
    },
  ],
  series: [
    {
      type: "boxplot",
      data: [{ name: "", value: 0 }],
    //   colorBy: "series",
      boxWidth: [1, 5],
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
