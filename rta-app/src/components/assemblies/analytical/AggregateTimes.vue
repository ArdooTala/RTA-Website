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
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch, onMounted, onUnmounted } from "vue";

const props = defineProps(["assembly_name"]);

const OP_NAMES = { 0: "PICKING", 1: "PLACING", 2: "LOADING", 3: "SCREWING", 8: "HOME" };

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
            let totalDuration = jsonRes.reduce((a, b) => a + b.total, 0) / 1000;

            let opDurations = jsonRes.map(x => {
                return {
                    name: OP_NAMES[x._id.type],
                    value: Number(x.total / 1000),
                    agent: x._id.executer,
                }
            });

            let agents = [...new Set(jsonRes.map(x => x._id.executer))];
            let opTypes = [...new Set(jsonRes.map(x => OP_NAMES[x._id.type]))];

            let placeholders = opTypes.map(opT => opDurations
                .filter(x => x.name == opT)
                .map(x => x.value)
                .reduce((a, b) => a + b, 0)
            );
            const cumulativeSum = (sum => value => sum += value)(0);

            let placeholderSerie = {
                name: "PlaceHolder",
                type: 'bar',
                stack: 'Total',
                data: [0,].concat(placeholders.map(cumulativeSum)),
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
            };

            let options = agents.map(agent => {
                return {
                    name: agent,
                    type: 'bar',
                    stack: 'Total',
                    data: opDurations.filter(x => x.agent == agent)
                };
            });

            option.value.xAxis.data = opTypes;
            option.value.series = [placeholderSerie,].concat(options);
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
        axisLabel: {
            rotate: -90,
            // interval: 0,
        },
        data: ['0', '1', '2', '3'],
    },
    yAxis: {
        type: "value",
    },
    tooltip: {
        formatter: '{a} [{b}]<br/>{c} seconds'
    },
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
                updateData();
            }
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
  
<style scoped></style>
  