import {View, Text, Pressable, StyleSheet, FlatList} from 'react-native';
import {
    useListExercisesQuery,
    useCreateSetMutation
} from '../../../store';
import {
    ExerciseType, WorkoutType
} from '../../../common/types';
import {
    ModalTemplate,
} from '../../../common';

type ExercisePickerModalProps = {
    onExit: Function
    workout: WorkoutType
    newWorkoutRank: number
}

const ExercisePickerModal = (props: ExercisePickerModalProps) => {

    const { data } = useListExercisesQuery({});
    const [createSet] = useCreateSetMutation();

    let exercises: ExerciseType[] | undefined = undefined;
    if(data){
        exercises = data.data
    }

    const onClickCreateExercise = (exerciseId: string) => {
        createSet({
          exerciseId,
          workoutId: props.workout.workoutId,
          exerciseRank: 0,
          workoutRank: props.newWorkoutRank,
          reps: 8,
          weight: 12,
          template: props.workout.template
        })
        props.onExit()
      }

    const renderExerciseSelector = ({item}: {item: ExerciseType}) => {
        const {exerciseId, name} = item;
        return (
            <Pressable
                    key={exerciseId}
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => onClickCreateExercise(exerciseId)}>
                <Text style={styles.textStyle}>{name}</Text>
            </Pressable>
        )
    }

    return (
        <ModalTemplate onExit={props.onExit} >
            <Text style={styles.header}>Which exercise do you want to add?</Text>
            <FlatList
                data={exercises}
                renderItem={renderExerciseSelector}
                keyExtractor={exercise => exercise.exerciseId}
                style={styles.flatlist}
            />
        </ModalTemplate>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingVertical: 8,
        fontSize: 15,
        fontWeight: 'bold'
    },
    button: {
        borderRadius: 5,
        padding: 10,
        width: '100%'
    },
    buttonClose: {
        backgroundColor: 'lightgrey',
        marginVertical: 3,
    },
    textStyle: {
        color: 'black',
        textAlign: 'center',
    },
    flatlist: {
        height: '80%'
    }
});

export { ExercisePickerModal }