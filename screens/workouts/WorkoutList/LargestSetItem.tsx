import { View, Text, StyleSheet } from 'react-native';
import {
    Exercise,
    Set
} from '../../../store';
import {
    getOneMaxRep
} from '../../../common/helper';

type LargestSetItemProps = {
    exercise: Exercise,
    sets: Set[],
}

const LargestSetItem = (props: LargestSetItemProps) => {

    const largestSet = props.sets.reduce((a, b) => getOneMaxRep(a) > getOneMaxRep(b) ? a : b);

    return (
        <View style={styles.container}>
            <Text> {props.sets.length + "x " + props.exercise.name} </Text>
            <Text> {largestSet.weight + " lb x " + largestSet.repCount}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'

    },
});

export { LargestSetItem }