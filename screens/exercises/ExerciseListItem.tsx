import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import {
    ExerciseType
} from '../../common/types';
import { ExerciseModal } from './ExerciseModal';

type ExerciseListItemProps = {
    exercise: ExerciseType,
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
        width: '100%'
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
        backgroundColor: 'lightgrey',
    },
});

export { ExerciseListItem }