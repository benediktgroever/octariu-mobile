import { Text, StyleSheet } from 'react-native';
import { Button } from '../../../common';
import {
    useDeleteWorkoutMutation,
} from '../../../store';
import {
    WORKOUTS
} from '../../../Routes';
import { Workout } from '../../../store';
import {
    ModalTemplate
} from '../../../common';
import { NavigationProp } from '@react-navigation/native';

type DeleteWorkoutModalProps = {
    onExit: Function
    workout: Workout
    navigation: NavigationProp<any, any>
}

const DeleteWorkoutModal = (props: DeleteWorkoutModalProps) => {

    const { deleteWorkout } = useDeleteWorkoutMutation();

    const onClickDeleteWorkout = () => {
        deleteWorkout({ workoutId: props.workout.workoutId })
        props.navigation.navigate(WORKOUTS)
    }

    return (
        <ModalTemplate onExit={props.onExit}>
            <Text style={styles.textStyle}>Are you sure you want to delete the workout?</Text>
            <Button onClick={onClickDeleteWorkout} style={{margin: 10, padding: 10}} text={'Delete workout'} />
        </ModalTemplate>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        backgroundColor: 'lightgrey',
        paddingVertical: 5,
        marginVertical: 10,
    },
    textStyle: {
        textAlign: 'left',
        width: '100%',
    },
});

export { DeleteWorkoutModal }