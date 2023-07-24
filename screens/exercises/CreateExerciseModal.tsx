import {Text, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import {
    useCreateExerciseMutation,
} from '../../store';
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

    const onClickCreateExercise = () => {
        createExercise({
            name: name,
        });
    }

    let content = (
        <React.Fragment>
            <Text style={styles.textStyle}>We are constantly adding new exercises. What exercise do you want us to add?</Text>
            {
                createExerciseMutation.isLoading ? <ActivityIndicator style={styles.activityIndicator} size="small"/> : <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                /> 
            }
            <Button onClick={onClickCreateExercise} text={'Request new exercise'}/>
        </React.Fragment>
    )

    if(createExerciseMutation.isSuccess){
        content = <Text style={styles.textStyle}>We will be in touch when we added the exercise.</Text>
    }

    return (
        <ModalTemplate onExit = {props.onExit}>
            {content}
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
    activityIndicator: {
        marginVertical: 10
    }
});

export { CreateExerciseModal }
