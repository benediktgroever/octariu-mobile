import {View, Text, StyleSheet} from 'react-native';
import { 
    ExerciseType, 
    SetType 
} from '../../../common/types';

type LargestSetItemProps = {
    exercise: ExerciseType,
    sets: SetType[],
}

const LargestSetItem = (props: LargestSetItemProps) => {

    const getOneMaxRep = (set: SetType) => set.weight / ((1.0278) - (0.0278 * set.reps ));
    const largestSet =  props.sets.reduce((a,b)=> getOneMaxRep(a) > getOneMaxRep(b) ? a : b);

    return (
        <View style={styles.container}>
            <Text> { props.sets.length + "x " + props.exercise.name } </Text>
            <Text> {largestSet.weight + " lb x " + largestSet.reps }</Text>
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