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
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch } from "vue";

const props = defineProps(["assembly_name"]);

function updateData() {
  fetch("http://159.89.15.80:5000/assemblies/timestamps/" + props.assembly_name)
    .then((jsonRes) => {
      return jsonRes.json();
    })
    .then((jsonRes) => {
      return jsonRes.map((x) => {
        let start = new Date();
        start.setTime(Date.parse(x.start_time));
        let end = new Date();
        end.setTime(Date.parse(x.end_time));

        return {
          name:
            x.assembly.assembly_name +
            " - " +
            x.assembly.part_name +
            " : " +
            x.type,
          value: [start, start, start, end, end],
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
    //   data: [...Array(22).keys()].map((x) => "OP" + x),
    inverse: true,
    //   boundaryGap: false,
    //   interval: 2,
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
  series: [
    // {
    //   data: props.timestamps.map((v, i) => [i, v]),
    //   type: "line",
    // },
    {
      type: "boxplot",
      data: [{ name: "", value: 0 }],
      colorBy: "series",
      boxWidth: [1, 5],
      encode: {
        y: "name",
        x: "value",
        tooltip: "name",
      },
    },
    // {
    //   type: "boxplot",
    //   data: props.timestamps.slice(2).map((v, i) => {
    //     return {
    //       name: "Operation " + i,
    //       value: [props.timestamps[i], props.timestamps[i + 1], v, v, v],
    //     };
    //   }),
    //   colorBy: "series",
    //   boxWidth: [1, 5],
    //   //   encode: {
    //   //     y: "value",
    //   //     x: "name",
    //   //     itemName: 'name'
    //   //   },
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
