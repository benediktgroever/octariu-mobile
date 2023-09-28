import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
    Exercise
} from '../../store';
import { ExerciseModal } from './ExerciseModal';

type ExerciseListItemProps = {
    exercise: Exercise,
}

const ExerciseListItem = (props: ExerciseListItemProps) => {

    const [showExerciseModal, changeShowExerciseModal] = useState(false);

    const onExit = () => {
        changeShowExerciseModal(false)
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.pressable}
                onPress={() => changeShowExerciseModal(true)}>
                <View style={styles.exerciseItem}>
                    <Text>{props.exercise.name}</Text>
                    <Text style={styles.muscleGroupText}>{props.exercise.muscleGroup}</Text>
                </View>
            </Pressable>
            {
                showExerciseModal && <ExerciseModal exercise={props.exercise} onExit={onExit} />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    pressable: {
        padding: 5,
        marginVertical: 5,
        backgroundColor: 'lightgrey',
        display: 'flex',
        width: '100%',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
          height: 1,
          width: 1
        }
    },
    muscleGroupText: {
        color: 'grey'
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseItem: {
    },
});

export { ExerciseListItem }