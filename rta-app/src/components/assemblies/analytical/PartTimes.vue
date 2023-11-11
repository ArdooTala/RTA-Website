<template>
    <div class="ratio ratio-16x9">
        <v-chart class="chart" :option="optionPartDurations" autoresize />
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

const props = defineProps(["assembly_name", "manual"]);

const OP_NAMES = { 0: "PICKING", 1: "PLACING", 2: "LOADING", 3: "SCREWING", 8: "HOME" };

function updateData() {
    fetch(
        import.meta.env.VITE_BACKEND_BASE_URL +
        "assemblies/" +
        (props.manual ? 'manual/' : '') +
        "part_durations/" +
        props.assembly_name
    )
        .then((jsonRes) => {
            return jsonRes.json();
        })
        .then((jsonRes) => {
            jsonRes.map(x => { x.total_duration /= 1000; });
            let op_types = [...new Set(jsonRes.map(x => x.op_type))].toSorted();
            let all_parts = [...new Set(jsonRes.map(x => x.part_name))].toSorted();

            optionPartDurations.value.xAxis.data = all_parts;

            optionPartDurations.value.series = op_types.map(opT => {
                let op_parts = jsonRes
                    .filter(x => x.op_type == opT)
                    .toSorted(x => x.start_time);

                return {
                    name: OP_NAMES[opT],
                    type: 'bar',
                    stack: 'Total',
                    data: all_parts.map(pName => {
                        return {
                            name: pName,
                            value: (op_parts.find(x => x.part_name == pName)?.total_duration) ?? '-',
                        }
                    }),
                };
            });

            optionPartDurations.value.series.unshift({
                name: "TOTAL",
                type: 'bar',
                data: all_parts.map(pName => {
                    return {
                        name: pName,
                        value: jsonRes.filter(x => x.part_name == pName).map(x => x.total_duration).reduce((a, b) => a + b, 0),
                    }
                }),
                itemStyle: {
                    // borderColor: "white",
                    // opacity: 0.8,
                    color: "white"
                },
            })
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

const optionPartDurations = ref({
    title: {
        text: "PART DURATIONS",
        left: "left",
    },
    backgroundColor: "rgba(0,0,0,0)",
    grid: {
        bottom: '10%',
        left: '3%',
        right: '3%',
        containLabel: true
    },
    xAxis: {
        type: "category",
        data: [],
        axisLabel: {
            rotate: -90,
            // interval: 0,
        },
    },
    yAxis: {
        type: "value",
        name: "Duration"
    },
    dataZoom: {
        type: "slider",
        yAxisIndex: 0,
    },
    tooltip: {
        trigger: 'item',
        formatter: "{a} - {b} - {c}"
        // formatter: (params, ticket, callback) => `${params.name}<br/>${params.value[4].toFixed().toLocaleString()}\"<br/>${params.value[5].toFixed().toLocaleString()}\"`,
    },
    series: [],
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
  