import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useWorkoutDiff } from '../../../common';
import {
    useUpdateWorkoutMutation,
} from '../../../store';
import { Workout } from '../../../store';
import {
    ModalTemplate
} from '../../../common';
import { NavigationProp } from '@react-navigation/native';

type FinishWorkoutModalProps = {
    onExit: Function
    workout: Workout
    navigation: NavigationProp<any, any>
}

const FinishWorkoutModal = (props: FinishWorkoutModalProps) => {

    const {
        countCreatedSets,
        countDeletedSets,
        countUpdatedSets,
        countCreatedExercises,
        countDeletedExercises,
        reorderd
    } = useWorkoutDiff({ workout: props.workout })

    const [updateCompleted, changeUpdateCompleted] = useState(false);
    const { updateWorkout, workout: workoutUpdateWorkout } = useUpdateWorkoutMutation();

    const updateWorkoutRequest = async (reorder: boolean) => {
        await updateWorkout({
            workoutId: props.workout.workoutParentId,
            copyWorkoutId: props.workout.workoutId,
            reorder
        })
        changeUpdateCompleted(true);
    }

    let createAndRemoveExerciseText = ``;
    if (countCreatedExercises || countDeletedExercises) {
        if (countCreatedExercises) {
            createAndRemoveExerciseText += `Adds ${countCreatedExercises} exercise`;
            if (countCreatedExercises > 1) {
                createAndRemoveExerciseText += `s`;
            }
        }
        if (countDeletedExercises) {
            if (countCreatedExercises) {
                createAndRemoveExerciseText += `, removes `;
            } else {
                createAndRemoveExerciseText += `Removes `;
            }
            createAndRemoveExerciseText += `${countDeletedExercises} exercise`;
            if (countDeletedExercises > 1) {
                createAndRemoveExerciseText += `s`;
            }
        }
    }

    let createAndRemoveSetText = ``;
    if (countCreatedSets || countDeletedSets) {
        if (countCreatedSets) {
            createAndRemoveSetText += `Adds ${countCreatedSets} set`;
            if (countCreatedSets > 1) {
                createAndRemoveSetText += `s`;
            }
        }
        if (countDeletedSets) {
            if (countCreatedSets) {
                createAndRemoveSetText += `, removes `;
            } else {
                createAndRemoveSetText += `Removes `;
            }
            createAndRemoveSetText += `${countDeletedSets} set`;
            if (countDeletedSets > 1) {
                createAndRemoveSetText += `s`;
            }
        }
    }

    let updateSetText = ``;
    if (countUpdatedSets) {
        updateSetText = `Update ${countUpdatedSets} set`;
        if (countUpdatedSets > 1) {
            createAndRemoveSetText += `s`;
        }
    }

    const setsUpdate = (countCreatedSets + countDeletedSets + countUpdatedSets + countCreatedExercises + countDeletedExercises) !== 0

    const updateButtonWithReordering = (
        <TouchableOpacity style={styles.button} onPress={() => updateWorkoutRequest(true)}>
            {
                (reorderd && setsUpdate) ? <Text style={styles.title}>Update original template
                    <Text>{'\n'}</Text> <Text style={{ fontWeight: "bold" }}>With</Text> reordering exercises</Text>
                    : (reorderd ? <Text style={styles.title}>Reorder exercises</Text>
                        : <Text style={styles.title}>Update original template</Text>)
            }
            {
                createAndRemoveExerciseText && <Text style={styles.textStyle}>{createAndRemoveExerciseText}</Text>
            }
            {
                createAndRemoveSetText && <Text style={styles.textStyle}>{createAndRemoveSetText}</Text>
            }
            {
                updateSetText && <Text style={styles.textStyle}>{updateSetText}</Text>
            }
        </TouchableOpacity>
    )

    const updateButtonWithoutReordering = (
        <TouchableOpacity style={styles.button} onPress={() => updateWorkoutRequest(false)}>
            <Text style={styles.title}>Update original template <Text>{'\n'}</Text>
                <Text style={{ fontWeight: "bold" }}>Without</Text> reordering exercises</Text>
            {
                createAndRemoveExerciseText && <Text style={styles.textStyle}>{createAndRemoveExerciseText}</Text>
            }
            {
                createAndRemoveSetText && <Text style={styles.textStyle}>{createAndRemoveSetText}</Text>
            }
            {
                updateSetText && <Text style={styles.textStyle}>{updateSetText}</Text>
            }
        </TouchableOpacity>
    )

    return (
        <ModalTemplate onExit={props.onExit}>
            {
                (!updateCompleted && (setsUpdate || reorderd)) ? <React.Fragment>
                    <Text style={styles.textStyleHeading}>Do you want to update the original template?</Text>
                    {(setsUpdate || reorderd) && updateButtonWithReordering}
                    {(setsUpdate && reorderd) && updateButtonWithoutReordering}
                    <TouchableOpacity style={styles.button} onPress={() => props.onExit()}>
                        <Text style={styles.title}>Keep current template</Text>
                    </TouchableOpacity>
                </React.Fragment> : <React.Fragment>
                    <Text style={styles.title}>You have succefully completed a new workout ! </Text>
                </React.Fragment>
            }
        </ModalTemplate>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 5,
        marginVertical: 5,
        backgroundColor: 'lightgrey',
        width: "100%",
    },
    input: {
        width: '100%',
        backgroundColor: 'lightgrey',
        paddingVertical: 5,
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        textAlign: "center",
    },
    textStyleHeading: {
        fontSize: 16,
        textAlign: "center",
    },
    textStyle: {
        textAlign: 'center',
        width: '100%',
        fontWeight: "300",
    },
});

export { FinishWorkoutModal }