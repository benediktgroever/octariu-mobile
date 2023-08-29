import Previous from './../../../assets/previous.svg';
import Trash from './../../../assets/trash-can.svg';
import Cross from './../../../assets/cross.svg';
import UpArrow from './../../../assets/up-arrow.svg';
import DownArrow from './../../../assets/down-arrow.svg';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    GestureResponderEvent
} from 'react-native';
import {
    FOREGROUND_COLOR
} from '../../../common/constants';
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
    expandAll: (event: GestureResponderEvent) => void,
    collapseAll: (event: GestureResponderEvent) => void,
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
                    <Previous style={styles.icon} />
                    <Text style={styles.textStyle}>Back</Text>
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
                    {active ? <Cross width={23} height={23} style={styles.icon} /> :
                        <Trash style={styles.icon} fill={'rgb(200,0,0)'} />}
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
            <View style={styles.expandButtons}>
                <TouchableOpacity style={styles.expandButtonItem} onPress={props.expandAll}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", flex: 1 }}>
                        <DownArrow height={20} width={20} />
                        <Text style={{ paddingLeft: 5, textAlign: "center" }}>Expand all</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.expandButtonItem} onPress={props.collapseAll}>
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "center", flex: 1 }}>
                        <UpArrow height={20} width={20} />
                        <Text style={{ paddingLeft: 5, textAlign: "center" }}>Collapse all</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    expandButtons: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    expandButtonItem: {
        flex: 1,
        textAlign: 'center',
        display: "flex",
        flexDirection: "row",
        paddingVertical: 3,
        margin: 1,
        backgroundColor: FOREGROUND_COLOR,
    },
    input: {
        paddingVertical: 3,
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
        margin: 5,
        padding: 5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 16,
        height: 16,
        margin: 2,
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
        color: 'black',
        fontWeight: "300",
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