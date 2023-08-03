import { Text, Pressable, StyleSheet, FlatList } from 'react-native';
import {
    Exercise,
    useListExercisesQuery,
} from '../store';
import {
    ModalTemplate,
} from '.';

type ExercisePickerModalProps = {
    onExit: Function
    onClickPickExercise: Function
    completed: number,
    exercises: Exercise[],
}

const ExercisePickerModal = (props: ExercisePickerModalProps) => {

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
            <Text style={styles.header}>Which exercise do you want to add?</Text>
            <FlatList
                data={props.exercises}
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
        width: '100%'
    }
});

export { ExercisePickerModal }