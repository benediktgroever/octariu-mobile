import React, { useState } from 'react';
import { NavBar } from '../../common';
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
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

    const { data, isLoading } = useListExercisesQuery({});
    const [showExercisePicker, changeShowExercisePicker] = useState(false);
    const [exercise, changeExercise] = useState<ExerciseType | undefined>(data ? data.data[0] : undefined);

    const onClickPickExercise = (exercise: ExerciseType) => {
        changeExercise(exercise)
        changeShowExercisePicker(false)
    }

    let content = <ActivityIndicator style={styles.activityIndicator} size="large"/>
    if( isLoading == false && exercise ){
        content = (
            <React.Fragment>
                <View style={styles.controlls}>
                    <Button style={{width: 300}} onClick={() => changeShowExercisePicker(true)} text={exercise.name}/>
                </View>
                <View style={styles.container}>
                    <HistoryChart navigation={props.navigation} exercise={exercise}/>
                </View>
            </React.Fragment>
        )
    }

    return (
        <NavBar navigation={props.navigation}>
            <View style={styles.container}>
                { content }
            </View>
            {
                showExercisePicker && <ExercisePickerModal
                    onExit={() => changeShowExercisePicker(false)}
                    onClickPickExercise={onClickPickExercise} 
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