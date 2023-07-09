import { useState, useEffect } from 'react';
import { 
    View, 
    Text,
    Pressable,
    StyleSheet,
    Image,
    TextInput
} from 'react-native';
import {
    useCreateWorkoutMutation,
    useUpdateWorkoutMutation,
    useDeleteWorkoutMutation,
} from '../../../store';
import {
    WORKOUTS
} from '../../../Routes';
import {
  WorkoutType
} from '../../../common/types';
import { Timer } from '../Timer';

type WorkoutHeaderProps = {
    workout: WorkoutType,
    navigation: any,
    onLoadingFromHeader: Function, 
}

const WorkoutHeader = (props: WorkoutHeaderProps) => {

    const active = !props.workout.template && props.workout.endTime === 0;
    const template = props.workout.template;
    const previous = !props.workout.template && props.workout.endTime !==0;

    const [name, onChangeName] = useState(props.workout.name);

    const [createWorkout, createWorkoutMutation] = useCreateWorkoutMutation();
    const [updateWorkout, updateWorkoutMutation] = useUpdateWorkoutMutation();
    const [deleteWorkout] = useDeleteWorkoutMutation();


    useEffect(() => {
        // end active workout
        if (updateWorkoutMutation.data){
            const workout = updateWorkoutMutation.data as WorkoutType;
            if(workout.endTime !== 0){
                props.onLoadingFromHeader(false);
                props.navigation.navigate(WORKOUTS);
            }
        }
        // create active workout from template
        if (createWorkoutMutation.data){
            const workout = createWorkoutMutation.data as WorkoutType;
            if(workout.workoutId !== props.workout.workoutId){
                props.onLoadingFromHeader(false);
                props.navigation.navigate(WORKOUTS,{workout})
            }
        }
    },  [
            updateWorkoutMutation,
            createWorkoutMutation,
        ]
    );


    const onClickFinishWorkout = () => {
        updateWorkout({
            workoutId: props.workout.workoutId,
            endTime: Date.now()
        })
        props.onLoadingFromHeader(true);
    }

    const onClickStartWorkout = () => {
        createWorkout({
            copyWorkoutId: props.workout.workoutId,
            weightIntensity: 1,
            repIntensity: 1,
            name: props.workout.name,
            startTime: Date.now()
        })
        props.onLoadingFromHeader(true);
    }

    const onSubmitEditingName = () => {
        updateWorkout({workoutId: props.workout.workoutId, name: name})
    }

    const options: Intl.DateTimeFormatOptions = { 
        weekday: undefined,
        year: undefined, 
        month: undefined, 
        day: undefined,
        hour: '2-digit',
        minute: '2-digit',
        second: undefined,
    };

    const onClickDeleteWorkout = () => {
        deleteWorkout({workoutId: props.workout.workoutId})
        props.navigation.navigate(WORKOUTS)
    }

    return (
        <View style={styles.workoutHeader}>
            <TextInput
                editable
                onChangeText={text => onChangeName(text)}
                onSubmitEditing={onSubmitEditingName}
                value={name}
                style={styles.input}
            />
            {
                active && <View style={styles.timerContainer}>
                    <Timer startTime={props.workout.startTime}/>
                </View>
            }
            <View style={styles.headerController}>
                <Pressable
                    style={[styles.button]}
                    onPress={() => props.navigation.navigate(WORKOUTS)}>
                    <Image source={require('./../../../assets/back-button.png')} style={{width: 20, height: 20}} />
                    <Text style={styles.textStyle}>Back</Text>
                </Pressable>
                {
                    active || template ? <View style={styles.container}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={active ? () => onClickFinishWorkout() : () => onClickStartWorkout() }>
                            <Text style={styles.textStyle}>{ active ? "Finish workout" : "Start workout"}</Text>
                        </Pressable>
                    </View> : <View style={styles.container}>
                        <Pressable
                            style={[styles.button]}
                            onPress={ () => console.log('here') }>
                            <Text> { "start: " + new Date(props.workout.startTime ).toLocaleTimeString('en-US', options) }</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button]}
                            onPress={ () => console.log('here') }>
                            <Text> { "end: " + new Date(props.workout.endTime ).toLocaleTimeString('en-US', options) }</Text>
                        </Pressable>
                    </View>
                }
                <Pressable
                    style={[styles.button]}
                    onPress={onClickDeleteWorkout}>
                    <Image source={require('./../../../assets/trash-can.png')} style={{width: 20, height: 20}} />
                    <Text style={styles.textStyle}>{ active ? "Cancel" : "Delete"}</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: 5, 
        textAlign: 'center',       
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    workoutHeader: {
        backgroundColor: 'lightgrey',
        textAlign: 'center',
    },
    button: {
        padding: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    headerController: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
    },
    textStyle: {
        color: 'darkblue',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    workoutHeaderText: {
        marginBottom: 5,
        marginTop: 5,
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 3,
    }
});

export { WorkoutHeader }