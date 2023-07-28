<template>
      <v-chart class="chart" :option="option" autoresize />
</template>

<script setup>
import { use } from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import { LineChart, BarChart, CandlestickChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide } from "vue";

use([
  SVGRenderer,
  LineChart,
  BarChart,
  ,
  CandlestickChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

provide(THEME_KEY, "dark");

const props = defineProps(["timestamps"]);

const option = ref({
  title: {
    text: "OPERATIONS DURATION",
    left: "left",
  },
  backgroundColor: "rgba(0,0,0,0)",
  xAxis: [
    {
      type: "value",
      boundaryGap: false,
      interval: 2,
    },
  ],
  yAxis: [
    {
      type: "time",
      scale: true,
      boundaryGap: ["10%", "10%"],
    },
  ],
  tooltip: {
    trigger: "item",
    formatter: "{c}",
  },
  series: [
    {
      data: props.timestamps.map((v, i) => [i, v]),
      type: "line",
    },
    {
      type: "candlestick",
      data: props.timestamps.slice(1).map((v, i) => {
        return [
            i + 1,
            props.timestamps[i], 
            v,
            props.timestamps[i], 
            v,
        ];
      }),
    },
  ],
});
</script>

<style scoped>
/* .chart {
      height: 100px;
    } */
</style>
