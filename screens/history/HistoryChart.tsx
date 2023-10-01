import { useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import {
    VictoryChart,
    VictoryTheme,
    VictoryLine,
    VictoryAxis,
    VictoryScatter,
    VictoryLabel,
    VictoryTooltip,
    VictoryVoronoiContainer,
} from "victory-native";
import {
    Set,
    useListSetsQuery
} from '../../store/';
import {
    Controls
} from '../../common/Controls';
import { NavigationProp } from '@react-navigation/native';
import { Exercise } from '../../store';
import { getOneMaxRep } from "../../common/helper";

type HistoryChartProps = {
    navigation: NavigationProp<any, any>
    exercise: Exercise
}

type DataEntry = {
    weight: number,
    completedAtMs: number,
    reps: number,
    onerpm: number
}

const HistoryChart = (props: HistoryChartProps) => {

    const { sets } = useListSetsQuery({
        exerciseId: props.exercise.exerciseId, template: false, completed: true
    })

    const [yAxisMetric, changeYAxisMetric] = useState("Weight");

    const data = sets.map((set: Set) => {
        return {
            "completedAtMs": set.completedAtMs,
            "weight": set.weight,
            "reps": set.repCount,
            "onerpm": getOneMaxRep(set),
        }
    });

    const selection2dataEntry = (yAxisMetric: string) => {
        if(yAxisMetric === "Weight"){
            return "weight";
        } else if(yAxisMetric === "Reps"){
            return "reps";
        }else if(yAxisMetric === "1 RPM"){
            return "onerpm";
        }
        return "weight";
    }

    const getYaxisValue = (entry: DataEntry) => {
        if(yAxisMetric === "Reps"){
            return entry.reps;
        }else if(yAxisMetric === "1 RPM"){
            return getOneMaxRep({repCount: entry.reps, weight: entry.weight});
        }
        return entry.weight;
    }

    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: undefined,
        year: undefined,
        month: '2-digit',
        day: '2-digit',
    };

    const getLabel = (entry: DataEntry) => {
        const date = new Date(entry.completedAtMs).toLocaleDateString('en-US', optionsDate);
        return `${date}, ${getYaxisValue(entry)}`;
    }

    const maxValue = data.reduce((maximum, entry) => {
        return (maximum = maximum > getYaxisValue(entry) ? maximum : getYaxisValue(entry));
    }, 0) + 1;

    return (
        <View style={styles.chart}>
            <View style={styles.completedCount}>
                <View style={styles.setCount}>
                    <Text style={styles.completedCountDisplay}> {sets.length} </Text>
                    <Text style={styles.completedCountDisplay}> sets completed</Text>
                </View>
                <Controls
                    selected={yAxisMetric}
                    selections={["Weight", "Reps", "1 RPM"]}
                    onSelectionClick={changeYAxisMetric}
                />
            </View>
            <VictoryChart
                containerComponent={<VictoryVoronoiContainer />}
                domainPadding={10}
                padding={{ top: 20, bottom: 60, right: 30, left: 60 }}
                theme={VictoryTheme.grayscale}
                style={{
                    background: { fill: 'lightblue' },
                    parent: { border: "5px solid", width: "100%", fill: 'lightblue', position: 'static' },
                }}>
                <VictoryLine
                    data={data}
                    x="completedAtMs"
                    y={selection2dataEntry(yAxisMetric)}
                />
                <VictoryScatter
                    data={data}
                    labels={({ datum }: {datum: DataEntry}) => {return getLabel(datum)}}
                    labelComponent={<VictoryTooltip renderInPortal={false} />}
                    x="completedAtMs"
                    y={selection2dataEntry(yAxisMetric)}
                />
                <VictoryAxis dependentAxis
                    axisLabelComponent={<VictoryLabel dx={0} />}
                    style={{ axisLabel: { padding: 40 } }}
                    label={yAxisMetric}
                    domain={[0, maxValue]}
                />
                <VictoryAxis
                    tickFormat={(t) => `${new Date(t).toLocaleDateString('en-US', optionsDate)}`}
                    style={{ axisLabel: { padding: 40 }, tickLabels: { angle: 0 } }}
                    axisLabelComponent={<VictoryLabel dy={-5} />}
                    label="Date"
                />
            </VictoryChart>
        </View>
    );
};

const styles = StyleSheet.create({
    setCount: {
        display: 'flex',
        flexDirection: 'row',
    },
    completedCount: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "90%",
    },
    completedCountDisplay: {
        fontWeight: "200",
    },
    chart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
})

export { HistoryChart }