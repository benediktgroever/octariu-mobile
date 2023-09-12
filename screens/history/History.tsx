import React, { useState } from 'react';
import { NavBar } from '../../common';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { HistoryChart } from './HistoryChart';
import { ExercisePickerModal } from '../../common';
import { useListCompletedExercisesQuery, Exercise } from '../../store';
import { Button } from '../../common';
import { HistoryList } from './HistoryList';
import { FOREGROUND_COLOR } from '../../common/constants'

type HistoryScreenProps = {
    navigation: NavigationProp<any, any>
}

const HistoryScreen = (props: HistoryScreenProps) => {

    const { exercises } = useListCompletedExercisesQuery();
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
                    <Button style={styles.changeExerciseButton} onClick={() => changeShowExercisePicker(true)} text={exercise.name} />
                </View>
                <View style={styles.container}>
                    <HistoryChart navigation={props.navigation} exercise={exercise} />
                    <HistoryList navigation={props.navigation} exercise={exercise} />
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
                    includeExercises={exercises}
                    questionText='Which exercise do you want to see?'
                />
            }
        </NavBar>
    );
};

const styles = StyleSheet.create({
    changeExerciseButton: {
        backgroundColor: FOREGROUND_COLOR,
        width: '90%',
        height: 45,
        margin: 5,
    },
    controlls: {
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