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
    useListSetsQuery
} from '../../store/';
import { NavigationProp } from '@react-navigation/native';
import { Exercise } from '../../store';

type HistoryChartProps = {
    navigation: NavigationProp<any, any>
    exercise: Exercise
}

const HistoryChart = (props: HistoryChartProps) => {

    const { sets } = useListSetsQuery({
        exerciseId: props.exercise.exerciseId, template: false, completed: true
    })

    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: undefined,
        year: undefined,
        month: '2-digit',
        day: '2-digit',
    };

    const maxWeight = sets.reduce((maximum, set) => {
        return (maximum = maximum > set.weight ? maximum : set.weight);
    }, 0) + 1;

    return (
        <View style={styles.chart}>
            <View style={styles.completedCount}>
                <Text style={styles.completedCountDisplay}> {sets.length} </Text>
                <Text style={styles.completedCount}> sets completed</Text>
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
                    data={sets}
                    x="completedAtMs"
                    y="weight"
                />
                <VictoryScatter
                    data={sets}
                    labels={({ datum }) => `${new Date(datum.completedAtMs).toLocaleDateString('en-US', optionsDate)}, ${datum.weight}`}
                    labelComponent={<VictoryTooltip renderInPortal={false} />}
                    x="completedAtMs"
                    y="weight"
                />
                <VictoryAxis dependentAxis
                    axisLabelComponent={<VictoryLabel dx={0} />}
                    style={{ axisLabel: { padding: 40 } }}
                    label="Weight"
                    domain={[0, maxWeight]}
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
    completedCount: {
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
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