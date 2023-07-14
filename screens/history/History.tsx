import { useState } from 'react';
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

    console.log(exercise)

    return (
        <NavBar navigation={props.navigation}>
            {
                exercise && <View style={styles.controlls}>
                    <Button style={{width: 300}} onClick={() => changeShowExercisePicker(true)} text={exercise.name}/>
                </View>
            }
            {
                isLoading && <ActivityIndicator style={styles.activityIndicator} size="large"/>
            }
            <View style={styles.container}>
                {
                    exercise &&  <HistoryChart navigation={props.navigation} exercise={exercise}/>
                }
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
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
    },
    activityIndicator: {
        display: 'flex',
        flex: 1,
        width: '100%',
    }
})

export { HistoryScreen }