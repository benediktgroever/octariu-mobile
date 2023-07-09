import {Text, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import { useState, useEffect } from 'react';
import {
    useCreateExerciseMutation,
} from '../../store';
import {
    EXERCISES
} from '../../Routes';
import { Button } from '../../common';
import {
    ModalTemplate
} from '../../common';
import { NavigationProp } from '@react-navigation/native';

type CreateExerciseModalProps = {
    onExit: Function
    navigation: NavigationProp<any, any>,
}

const CreateExerciseModal = (props: CreateExerciseModalProps) => {

    const [createExercise, createExerciseMutation] = useCreateExerciseMutation();
    const [name, onChangeName] = useState('');

    useEffect(() => {
        if(createExerciseMutation.isSuccess){
            props.navigation.navigate(EXERCISES)
        }
    },
        [
            createExerciseMutation
        ]
    );

    const onClickCreateExercise = () => {
        createExercise({
            name: name,
        });
        props.onExit()
    }

    return (
        <ModalTemplate onExit = {props.onExit}>
            <Text style={styles.textStyle}>Exercise's name</Text>
            {
                createExerciseMutation.isLoading ? <ActivityIndicator size="large"/> : <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                /> 
            }
            <Button onClick={onClickCreateExercise} text={'Create new exercise'}/>
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

export { CreateExerciseModal }
