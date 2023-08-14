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
    Workout, useCreateWorkoutMutation, useUpdateWorkoutMutation
} from '../../../store';
import {
    WORKOUTS
} from '../../../Routes';
import { Timer } from '../Timer';
import {
    DeleteWorkoutModal
} from './DeleteWorkoutModal';
import { NavigationProp } from '@react-navigation/native';
import { EditWorkoutDateTimeModal } from './EditWorkoutDateTimeModal';

type WorkoutHeaderProps = {
    workout: Workout,
    navigation: NavigationProp<any, any>,
    onLoadingFromHeader: Function,
}

const WorkoutHeader = (props: WorkoutHeaderProps) => {

    const active = !props.workout.template && props.workout.endTimeMs === 0;
    const template = props.workout.template;
    const previous = !props.workout.template && props.workout.endTimeMs !== 0;

    const [name, onChangeName] = useState(props.workout.name);
    const [showDeleteWorkoutModal, changeShowDeleteWorkoutModal] = useState(false);
    const [showEditWorkoutDateTimeModal, changeShowEditWorkoutDateTimeModal] = useState(false);

    const { createWorkout, workout: workoutCreateWorkout } = useCreateWorkoutMutation();
    const { updateWorkout, workout: workoutUpdateWorkout } = useUpdateWorkoutMutation();


    useEffect(() => {
        // end active workout
        if (workoutUpdateWorkout) {
            if (workoutUpdateWorkout.endTimeMs !== 0) {
                props.onLoadingFromHeader(false);
                props.navigation.navigate(WORKOUTS);
            }
        }
        // create active workout from template
        if (workoutCreateWorkout) {
            if (workoutCreateWorkout.workoutId !== props.workout.workoutId) {
                props.onLoadingFromHeader(false);
                props.navigation.navigate(WORKOUTS, { workout: workoutCreateWorkout })
            }
        }
    }, [
        workoutCreateWorkout,
        workoutUpdateWorkout,
    ]
    );


    const onClickFinishWorkout = () => {
        updateWorkout({
            workoutId: props.workout.workoutId,
            endTimeMs: Date.now()
        })
        props.onLoadingFromHeader(true);
    }

    const onClickStartWorkout = () => {
        createWorkout({
            copyWorkoutId: props.workout.workoutId,
            weightIntensity: 1,
            repIntensity: 1,
            name: props.workout.name,
            startTimeMs: Date.now()
        })
        props.onLoadingFromHeader(true);
    }

    const onSubmitEditingName = () => {
        updateWorkout({ workoutId: props.workout.workoutId, name: name })
    }

    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: undefined,
        month: 'short',
        day: '2-digit',
    };

    const options: Intl.DateTimeFormatOptions = {
        weekday: undefined,
        year: undefined,
        month: undefined,
        day: undefined,
        hour: '2-digit',
        minute: '2-digit',
        second: undefined,
    };

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
                    <Timer startTime={props.workout.startTimeMs} />
                </View>
            }
            <View style={styles.headerController}>
                <Pressable
                    style={[styles.button]}
                    onPress={() => props.navigation.navigate(WORKOUTS)}>
                    <Image source={require('./../../../assets/back-button.png')} style={{ width: 20, height: 20 }} />
                    <Text style={styles.textStyle}>All</Text>
                </Pressable>
                {
                    active || template ? <View style={styles.container}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={active ? () => onClickFinishWorkout() : () => onClickStartWorkout()}>
                            <Text style={styles.textStyle}>{active ? "Finish workout" : "Start workout"}</Text>
                        </Pressable>
                    </View> : <View style={styles.container}>
                        <Pressable
                            style={[styles.button]}
                            onPress={() => changeShowEditWorkoutDateTimeModal(true)}>
                            <Text>
                                {
                                    new Date(props.workout.startTimeMs).toLocaleDateString('en-US', optionsDate)
                                }
                            </Text>
                            <Text>
                                {
                                    new Date(props.workout.startTimeMs).toLocaleTimeString('en-US', options)
                                    + '  -  ' + new Date(props.workout.endTimeMs).toLocaleTimeString('en-US', options)
                                }
                            </Text>
                        </Pressable>
                    </View>
                }
                <Pressable
                    style={[styles.button]}
                    onPress={() => { changeShowDeleteWorkoutModal(true) }}>
                    <Image source={require('./../../../assets/trash-can.png')} style={{ width: 20, height: 20 }} />
                    <Text style={styles.textStyle}>{active ? "Cancel" : "Delete"}</Text>
                </Pressable>
                {
                    showDeleteWorkoutModal && <DeleteWorkoutModal
                        navigation={props.navigation}
                        workout={props.workout}
                        onExit={() => {
                            changeShowDeleteWorkoutModal(false)
                        }}
                    />
                }
                {
                    showEditWorkoutDateTimeModal && <EditWorkoutDateTimeModal
                        navigation={props.navigation}
                        workout={props.workout}
                        onExit={() => {
                            changeShowEditWorkoutDateTimeModal(false)
                        }}
                    />
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        paddingVertical: 5,
        textAlign: 'center',
        fontSize: 15,
        fontWeight: 'bold',
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