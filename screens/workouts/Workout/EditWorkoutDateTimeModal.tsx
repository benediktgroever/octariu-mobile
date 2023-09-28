import { View, Text, StyleSheet } from 'react-native';
import { Button } from '../../../common';
import {
    useUpdateWorkoutMutation,
} from '../../../store';
import { Workout } from '../../../store';
import {
    ModalTemplate
} from '../../../common';
import { NavigationProp } from '@react-navigation/native';
import DatePicker from 'react-native-date-picker'
import { useState, useEffect } from 'react';


type EditWorkoutDateTimeModalProps = {
    onExit: Function
    workout: Workout
    navigation: NavigationProp<any, any>
}

const EditWorkoutDateTimeModal = (props: EditWorkoutDateTimeModalProps) => {

    const [startTime, changeStartTime] = useState(new Date(props.workout.startTimeMs));
    const [endTime, changeEndTime] = useState(new Date(props.workout.endTimeMs));
    const [warning, changeWarning] = useState('');
    const { updateWorkout, isLoading, workout: updatedWorkout } = useUpdateWorkoutMutation();

    useEffect(() => {
        if (startTime > endTime) {
            changeWarning("Start time can't be before end time")
        } else {
            changeWarning("")
        }
        if (updatedWorkout) {
            props.onExit()
        }
    }, [
        startTime,
        endTime,
        updatedWorkout,
    ]
    );

    const onClickUpdateWorkout = () => {
        if (warning) {
            return;
        }
        updateWorkout({
            workoutId: props.workout.workoutId,
            startTimeMs: startTime.valueOf(),
            endTimeMs: endTime.valueOf(),
        })
    }

    return (
        <ModalTemplate onExit={props.onExit}>
            <View style={styles.container}>
                <Text style={styles.header}>Edit start & end time</Text>
                <Text style={styles.subheader}>Start time</Text>
                <DatePicker style={{height: 150}} date={startTime} onDateChange={changeStartTime} />
                <Text style={styles.subheader}>End time</Text>
                <DatePicker style={{height: 150}} date={endTime} onDateChange={changeEndTime} />
                {
                    warning && <Text style={styles.warning}> {warning}</Text>
                }
                <Button
                    onClick={onClickUpdateWorkout}
                    text='Update workout'
                    isLoading={isLoading}
                    style={{margin: 10, padding: 10}}
                />
            </View>
        </ModalTemplate>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    header: {
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
    },
    subheader: {
        textAlign: 'left',
        fontSize: 15,
        fontWeight: 'bold'
    },
    warning: {
        textAlign: "left",
        color: 'red',
    }
});

export { EditWorkoutDateTimeModal }