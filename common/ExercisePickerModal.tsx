import { Text, Pressable, StyleSheet, FlatList, View } from 'react-native';
import {
    Exercise,
    useListExercisesQuery,
} from '../store';
import {
    Dropdown,
    ModalTemplate,
} from '.';

type ExercisePickerModalProps = {
    onExit: Function
    questionText: string,
    onClickPickExercise: Function
    includeExercises?: Exercise[] | undefined,
}

const ExercisePickerModal = (props: ExercisePickerModalProps) => {

    const { exercises, uniqueEquipments, uniqueMuscleGroups,
        changeFilterEquipment, changeFilterMuscleGroup } = useListExercisesQuery();

    const includeExercisesSet = new Set(props.includeExercises ? props.includeExercises : [])
    const filteredExercises = props.includeExercises ?
        exercises.filter(exercise => includeExercisesSet.has(exercise)) : exercises

    const renderExerciseSelector = ({ item }: { item: Exercise }) => {
        const { exerciseId, name } = item;
        return (
            <Pressable
                key={exerciseId}
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.onClickPickExercise(item)}>
                <Text style={styles.textStyle}>{name}</Text>
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
                />
                <Dropdown
                    label={'Any equipment'}
                    data={uniqueEquipments}
                    onSelect={changeFilterEquipment}
                />
            </View>
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
    header: {
        paddingVertical: 8,
        fontSize: 15,
        fontWeight: 'bold'
    },
    button: {
        borderRadius: 5,
        padding: 10,
        width: '100%'
    },
    buttonClose: {
        backgroundColor: 'lightgrey',
        marginVertical: 3,
    },
    textStyle: {
        color: 'black',
        textAlign: 'center',
    },
    flatlist: {
        height: '80%',
        width: '100%',
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