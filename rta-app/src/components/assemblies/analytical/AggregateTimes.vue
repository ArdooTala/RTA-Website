<template>
    <div class="h-100">
        <v-chart class="chart" :option="option" autoresize />
    </div>
</template>
  
<script setup>
import { use } from "echarts/core";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import {
    BarChart,
} from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent,
    VisualMapComponent,
    GridComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch, onMounted, onUnmounted } from "vue";

const props = defineProps(["assembly_name"]);

function updateData() {
    fetch(
        import.meta.env.VITE_BACKEND_BASE_URL +
        "assemblies/durations/" +
        props.assembly_name
    )
        .then((jsonRes) => {
            return jsonRes.json();
        })
        .then((jsonRes) => {
            let total = jsonRes.reduce((a, b) => a + b.duration, 0) / 1000;
            let durations = jsonRes.map(x => x.duration / 1000);
            let ops = jsonRes.map(x => x._id);

            const cumulativeSum = (sum => value => sum += value)(0);

            option.value.series[0].data = [0, 0].concat(durations.map(cumulativeSum));
            option.value.series[1].data = [total].concat(durations);
            option.value.xAxis.data = ["Total",].concat(ops)
        });
}

// ECharts Setup
use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);
provide(THEME_KEY, "dark");

const option = ref({
    title: {
        text: "ASSEMBLY DURATIONS",
        left: "left",
    },
    backgroundColor: "rgba(0,0,0,0)",
    grid: {
        containLabel: true
    },
    xAxis: {
        type: "category",
        data: ['Total', '0', '1', '2', '3'],
    },
    yAxis: {
        type: "value",
    },
    tooltip: {},
    series: [
        {
            name: "PlaceHolder",
            type: 'bar',
            stack: 'Total',
            data: [5, 1, 2, 1, 2],
            itemStyle: {
                borderColor: 'transparent',
                color: 'transparent'
            },
            emphasis: {
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                }
            },
        },
        {
            name: "Op Agg Times",
            type: 'bar',
            stack: 'Total',
            data: [5, 1, 2, 1, 2],
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
  