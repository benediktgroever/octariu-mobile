import {View, Text, StyleSheet} from 'react-native';
import { Set } from './Set';
import { Button } from '../../../common';
import {
    useCreateSetMutation,
} from '../../../store';
import { 
    ExerciseType, 
    SetType,
    WorkoutType
} from '../../../common/types';

type ExerciseListItemProps = {
    exercise: ExerciseType,
    sets: SetType[],
    workout: WorkoutType
}

const ExerciseListItem = (props: ExerciseListItemProps) => {


    const [createSet] = useCreateSetMutation();

    const maxExerciseRank: number = Math.max(...props.sets.map((set: SetType) => {
        return set.exerciseRank
    }))

    const sortedSets: SetType[] = props.sets.sort(function(a,b){
        return a.exerciseRank - b.exerciseRank;
    });

    const onClickCreateSet = () => {
        createSet({
            copySetId: sortedSets[sortedSets.length -1].setId,
            exerciseRank: maxExerciseRank+1,
            workoutRank: sortedSets[0].workoutRank,
        })
    }

    return (
        <View style={styles.container}>
            <Text> { props.exercise.name } </Text>
            {
                sortedSets && sortedSets.map((set: SetType, index: number) => {
                    return <Set
                        key={set.setId}
                        counter={index+1}
                        set={set}
                        workout={props.workout}
                    />
                })
            }
            <Button text={'Add set'} onClick={onClickCreateSet}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 300
    },
});

export { ExerciseListItem }