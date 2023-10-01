import React, { useState } from 'react';
import Plus from '../../assets/addition.svg'
import { NavBar, Dropdown } from '../../common';
import { View, StyleSheet, Pressable, Text, FlatList, ActivityIndicator, TextInput } from 'react-native';
import {
    ExerciseListItem
} from './ExerciseListItem';
import {
    CreateExerciseModal
} from './CreateExerciseModal';
import { NavigationProp } from '@react-navigation/native';
import {
    useListExercisesQuery, Exercise
} from '../../store';
import { BACKGROUND_COLOR, FOREGROUND_COLOR } from '../../common/constants';

type ExercisesScreenProps = {
    navigation: NavigationProp<any, any>
}

const ExercisesScreen = (props: ExercisesScreenProps) => {

    const {
        exercises,
        uniqueEquipments,
        uniqueMuscleGroups,
        changeFilterMuscleGroup,
        changeFilterEquipment
    } = useListExercisesQuery();

    const [searchQuery, changeSearchQuery] = useState<undefined|string>(undefined);
    const [showCreateExerciseModal, changeShowCreateExerciseModal] = useState(false);

    const filteredExercises = exercises.filter(exercise =>
        searchQuery === undefined || exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === ""
    );

    const renderExercise = ({ item }: { item: Exercise }) => {
        return <ExerciseListItem key={item.exerciseId} exercise={item} />
    }

    let content = <ActivityIndicator style={styles.activityIndicator} size="large" />
    if (exercises) {
        content = (
            <React.Fragment>
                <View style={styles.templateHeader}>
                    <Text style={styles.header}>Exercises</Text>
                    <Pressable
                        style={styles.button}
                        onPress={() => changeShowCreateExerciseModal(!showCreateExerciseModal)}>
                        <Plus width={23} height={23} style={styles.icon} />
                        <Text style={styles.buttonText}>
                            Request
                        </Text>
                    </Pressable>
                </View>
                <View style={styles.selection}>
                    <Dropdown
                        label={'Any muscle group'}
                        data={uniqueMuscleGroups}
                        onSelect={changeFilterMuscleGroup}
                        backgroundColor={BACKGROUND_COLOR}
                    />
                    <Dropdown
                        label={'Any equipment'}
                        data={uniqueEquipments}
                        onSelect={changeFilterEquipment}
                        backgroundColor={BACKGROUND_COLOR}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    onChangeText={changeSearchQuery}
                    value={searchQuery}
                    placeholder='Search exercises'
                ></TextInput>
                <FlatList
                    data={filteredExercises}
                    renderItem={renderExercise}
                    keyExtractor={exercise => exercise.exerciseId}
                    style={styles.flatlist}
                />
            </React.Fragment>
        )
    }

    return (
        <NavBar navigation={props.navigation}>
            <View style={styles.container}>
                {content}
                {
                    showCreateExerciseModal && <CreateExerciseModal onExit={() => changeShowCreateExerciseModal(false)} navigation={props.navigation} />
                }
            </View>
        </NavBar>
    );
};

const styles = StyleSheet.create({
    input: {
        backgroundColor: FOREGROUND_COLOR,
        width: "95%",
        padding: 10,
        margin: 2,
        borderRadius: 3,
        zIndex: -1,
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
          height: 1,
          width: 1
        }
    },
    icon: {
        width: 20,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginRight: 20,
    },
    buttonText: {
        fontSize: 10,
    },
    templateHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    header: {
        fontSize: 20,
        margin: 10,
    },
    flatlist: {
        display: 'flex',
        width: '95%',
        zIndex: -1,
    },
    exerciseItem: {
        paddingVertical: 5,
        marginVertical: 5,
        backgroundColor: 'lightgrey',
    },
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    },
    activityIndicator: {
        display: 'flex',
        flex: 1,
        width: '100%',
    },
    selection: {
        dipslay: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '95%'
    }
});

export { ExercisesScreen }