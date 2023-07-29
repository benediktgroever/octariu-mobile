import { Text, Pressable, StyleSheet, FlatList } from 'react-native';
import {
    useListExercisesQuery,
} from '../store';
import {
    ExerciseType
} from './types';
import {
    ModalTemplate,
} from '.';

type ExercisePickerModalProps = {
    onExit: Function
    onClickPickExercise: Function
}

const ExercisePickerModal = (props: ExercisePickerModalProps) => {

    const { data } = useListExercisesQuery({});

    let exercises: ExerciseType[] | undefined = undefined;
    if (data) {
        exercises = data.data
    }

    const renderExerciseSelector = ({ item }: { item: ExerciseType }) => {
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
                data={exercises}
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
        height: '80%'
    }
});

export { ExercisePickerModal }