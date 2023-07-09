import { useState } from 'react';
import {View, TextInput, StyleSheet, Pressable, Image} from 'react-native';
import {
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
} from '../../store';
import {
    ExerciseType
}from '../../common/types';

type ExerciseListItemProps = {
    exercise: ExerciseType,
}

const ExerciseListItem = (props: ExerciseListItemProps) => {

    const [name, onChangeName] = useState(props.exercise.name);

    const [updateExercise] = useUpdateExerciseMutation();
    const [deleteExercise] = useDeleteExerciseMutation();

    const onSubmitEditingName = () => {
        updateExercise({exerciseId: props.exercise.exerciseId, name: name})
    }

    const onClickDeleteExercise = () => {
        deleteExercise({exerciseId: props.exercise.exerciseId});
    }

    return (
        <View style={styles.container}>
            <TextInput
                editable
                onChangeText={text => onChangeName(text)}
                onSubmitEditing={onSubmitEditingName}
                value={name}
                style={styles.input}
            />
            {/* <View>
                <Pressable
                    onPress={onClickDeleteExercise}>
                    <Image
                        source={require('../../assets/trash-can.png')}
                        style={styles.icon}
                    />
                </Pressable>
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        margin: 10,
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        margin: 5,
        padding: 5,
        flex: 1,
    },
});

export { ExerciseListItem }