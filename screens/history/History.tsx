import React, { useState, useEffect } from 'react';
import { NavBar } from '../../common';
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { HistoryChart } from './HistoryChart';
import { ExercisePickerModal } from '../../common';
import { ExerciseType } from '../../common/types';
import { useListExercisesQuery } from '../../store';
import { Button } from '../../common';

type HistoryScreenProps = {
    navigation: NavigationProp<any, any>
}

const HistoryScreen = (props: HistoryScreenProps) => {

    const { data, isLoading } = useListExercisesQuery({ completed: 1 });
    const [showExercisePicker, changeShowExercisePicker] = useState(false);
    const [exercise, changeExercise] = useState<ExerciseType | undefined>(undefined);

    const onClickPickExercise = (exercise: ExerciseType) => {
        changeExercise(exercise)
        changeShowExercisePicker(false)
    }

    let content = <ActivityIndicator style={styles.activityIndicator} size="large" />
    useEffect(() => {
        if (data) {
            changeExercise(data.data[0])
        }
    }, [data])
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