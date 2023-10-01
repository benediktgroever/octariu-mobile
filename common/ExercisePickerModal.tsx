import { Text, Pressable, StyleSheet, FlatList, View } from 'react-native';
import {
    Exercise,
    useListExercisesQuery,
} from '../store';
import {
    Dropdown,
    ModalTemplate,
} from '.';
import {
    usePreviousBestSets
} from '../common';
import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import { FOREGROUND_COLOR } from './constants';

type ExercisePickerModalProps = {
    onExit: Function
    questionText: string,
    onClickPickExercise: Function
    includeExercises?: Exercise[] | undefined,
}

const ExercisePickerModal = (props: ExercisePickerModalProps) => {

    const { exercises, uniqueEquipments, uniqueMuscleGroups,
        changeFilterEquipment, changeFilterMuscleGroup } = useListExercisesQuery();

    const {
        exerciseCount
    } = usePreviousBestSets({});

    const [searchQuery, changeSearchQuery] = useState<undefined|string>(undefined);
    const includeExercisesSet = new Set(props.includeExercises ? props.includeExercises : [])
    let filteredExercises = props.includeExercises ?
        exercises.filter(exercise => includeExercisesSet.has(exercise)) : exercises

    filteredExercises = filteredExercises.filter(exercise =>
        searchQuery == undefined || exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery == ""
    );

    const renderExerciseSelector = ({ item }: { item: Exercise }) => {
        const { exerciseId, name } = item;
        const count = exerciseCount[exerciseId];
        return (
            <Pressable
                key={exerciseId}
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.onClickPickExercise(item)}>
                <Text style={styles.textStyle}>{name}</Text>
                <Text style={[styles.textStyle, styles.faintTextStyle]}>{count}</Text>
            </Pressable>
        )
    }

    return (
        <ModalTemplate onExit={props.onExit} >
            <Text style={styles.header}> {props.questionText}</Text>
            <View style={styles.selection}>
                <Dropdown
                    label={'Any muscle group'}
                    data={uniqueMuscleGroups}
                    onSelect={changeFilterMuscleGroup}
                    backgroundColor={'white'}
                />
                <Dropdown
                    label={'Any equipment'}
                    data={uniqueEquipments}
                    onSelect={changeFilterEquipment}
                    backgroundColor={'white'}
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
                renderItem={renderExerciseSelector}
                keyExtractor={exercise => exercise.exerciseId}
                style={styles.flatlist}
            />
        </ModalTemplate>
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
    header: {
        paddingVertical: 8,
        fontSize: 15,
        fontWeight: 'bold'
    },
    button: {
        borderRadius: 5,
        padding: 10,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
          height: 1,
          width: 1
        }
    },
    faintTextStyle: {
        color: 'grey'
    },
    buttonClose: {
        backgroundColor: 'lightgrey',
        marginVertical: 3,
    },
    textStyle: {
        color: 'black',
        textAlign: 'left',
    },
    flatlist: {
        height: '80%',
        width: '95%',
        zIndex: -1,
    },
    selection: {
        dipslay: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '95%',
    }
});

export { ExercisePickerModal }