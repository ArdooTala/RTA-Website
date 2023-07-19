<template>
    <div
      class="ratio ratio-1x1 rounded-4 bg-dark overflow-hidden"
      data-bs-theme="dark"
    >
      <div class="p-2">
        <v-chart class="chart" :option="option" />
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
  import { ref, provide } from "vue";
  
  use([SVGRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);
  
  provide(THEME_KEY, "dark");
  
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
      data: ["Svetlana", "Mercedes"],
    },
    series: [
      {
        name: "Parts Assembled",
        type: "pie",
        radius: ["30%", "60%"],
        center: ["50%", "50%"],
        data: [
          { value: 35, name: "Svetlana" },
          { value: 31, name: "Mercedes" },
        ],
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
  </script>
  
  <style scoped>
  /* .chart {
    height: 100px;
  } */
  </style>
  