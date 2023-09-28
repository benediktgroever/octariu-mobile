import { Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from '../../../common';
import { useState, useEffect } from 'react';
import {
    useCreateWorkoutMutation,
} from '../../../store';
import {
    WORKOUTS
} from '../../../Routes';
import {
    ModalTemplate
} from '../../../common';
import { NavigationProp } from '@react-navigation/native';

type CreateWorkoutModalProps = {
    onExit: Function
    navigation: NavigationProp<any, any>
}

const CreateWorkoutModal = (props: CreateWorkoutModalProps) => {

    const { createWorkout, isLoading, workout: createdWorkout } = useCreateWorkoutMutation();
    const [name, onChangeName] = useState('');

    useEffect(() => {
        if (createdWorkout) {
            props.navigation.navigate(WORKOUTS, { workout: createdWorkout })
        }
    }, [
        createdWorkout
    ]
    );

    const createWorkoutTemplate = () => {
        createWorkout({
            name: name,
        });
    }

    return (
        <ModalTemplate onExit={props.onExit}>
            <Text style={styles.textStyle}>Your template's name</Text>
            {
                isLoading ? <ActivityIndicator size="large" /> : <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                />
            }
            <Button
                style={{margin: 10, padding: 10}}
                onClick={createWorkoutTemplate}
                text={'Create new template'}
            />
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

export { CreateWorkoutModal }
