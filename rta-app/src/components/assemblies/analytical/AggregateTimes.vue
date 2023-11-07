<template>
    <div class="row">
        <div class="col-4">
            <div class="ratio" style="--bs-aspect-ratio: 200%;">
                <v-chart class="chart" :option="optionAggregate" autoresize />
            </div>
        </div>
        <div class="col-8">
            <div class="row">
                <div v-for="optOpDur in optionOpDurations" class="col-12 col-lg-6">
                    <div class="ratio ratio-1x1">
                        <v-chart class="chart" :option="optOpDur" autoresize />
                    </div>
                </div>
            </div>
        </div>
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
import histogram from "histogramjs";

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
            let agents = [...new Set(jsonRes.map(x => x._id.executer))];
            let opTypes = [...new Set(jsonRes.map(x => OP_NAMES[x._id.type]))];

            let placeholders = opTypes.map(opT => jsonRes
                .filter(x => OP_NAMES[x._id.type] == opT)
                .map(x => x.total / 1000)
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
                    data: jsonRes.filter(x => x._id.executer == agent).map(x => {
                        return {
                            name: OP_NAMES[x._id.type],
                            value: Number(x.total / 1000),
                        }
                    }),
                };
            });

            optionAggregate.value.xAxis.data = opTypes;
            optionAggregate.value.series = [placeholderSerie,].concat(options);

            let opDurs = opTypes.map(opT => {
                return {
                    name: opT,
                    value: jsonRes
                        .filter(x => OP_NAMES[x._id.type] == opT)
                        .map(x => x.durations)
                        .flat()
                }

            });

            // optionOpDurations.value[0].series = opDurs.map(od => {
            //     return {
            //         name: od.name,
            //         type: 'line',
            //         data: od.value.toSorted((a, b) => a - b).map((x, j) => [j, x / 1000])
            //     }
            // });

            optionOpDurations.value = opDurs.map(od => {
                return {
                    title: {
                        text: od.name + " DURATIONS",
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
                        type: "value",
                        scale: true,
                        axisLabel: {
                            show: false
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: "Op Duration"
                    },
                    tooltip: {},
                    series: [{
                        name: od.name,
                        type: 'bar',
                        large: true,
                        // data: makeHistogram(od.value, 100),
                        data: od.value.toSorted((a, b) => a - b).map((x, j) => [j, x / 1000]),
                    }],
                };
            });
        });
}

// function makeHistogram(vals, bins) {
//     let hist = histogram({
//         data: vals,
//         bins: bins
//     });
//     return hist.map((x) => [(x.reduce((a, b) => a + b, 0) / x.length).toFixed(), x.length]);
// }

// ECharts Setup
use([
    CanvasRenderer,
    BarChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);
provide(THEME_KEY, "dark");

const optionAggregate = ref({
    title: {
        text: "ASSEMBLY DURATIONS",
        left: "left",
    },
    backgroundColor: "rgba(0,0,0,0)",
    grid: {
        bottom: 0,
        left: '3%',
        right: '3%',
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
    series: [],
});

const optionOpDurations = ref([]);

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
  