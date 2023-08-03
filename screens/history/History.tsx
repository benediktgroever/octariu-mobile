import React, { useState, useEffect } from 'react';
import { NavBar } from '../../common';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { HistoryChart } from './HistoryChart';
import { ExercisePickerModal } from '../../common';
import { useListCompletedExercisesQuery, Exercise } from '../../store';
import { Button } from '../../common';

type HistoryScreenProps = {
    navigation: NavigationProp<any, any>
}

const HistoryScreen = (props: HistoryScreenProps) => {

    const { exercises } = useListCompletedExercisesQuery({ completed: 1 });
    const [showExercisePicker, changeShowExercisePicker] = useState(false);
    const [exercise, changeExercise] = useState<Exercise | undefined>(exercises.length ? exercises[0] : undefined);

    const onClickPickExercise = (exercise: Exercise) => {
        changeExercise(exercise)
        changeShowExercisePicker(false)
    }

    let content = <ActivityIndicator style={styles.activityIndicator} size="large" />
    if (exercise) {
        content = (
            <React.Fragment>
                <View style={styles.controlls}>
                    <Button style={{ width: 300 }} onClick={() => changeShowExercisePicker(true)} text={exercise.name} />
                </View>
                <View style={styles.container}>
                    <HistoryChart navigation={props.navigation} exercise={exercise} />
                </View>
            </React.Fragment>
        )
    }

    return (
        <NavBar navigation={props.navigation}>
            <View style={styles.container}>
                {content}
            </View>
            {
                showExercisePicker && <ExercisePickerModal
                    onExit={() => changeShowExercisePicker(false)}
                    onClickPickExercise={onClickPickExercise}
                    completed={1}
                    exercises={exercises}
                />
            }
        </NavBar>
    );
};

const styles = StyleSheet.create({
    controlls: {
        paddingVertical: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    activityIndicator: {
        display: 'flex',
        flex: 1,
        width: '100%',
    }
})

export { HistoryScreen }