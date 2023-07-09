import { Text, TextInput, StyleSheet, ActivityIndicator} from 'react-native';
import { Button } from '../../../common';
import { useState, useEffect } from 'react';
import {
    useCreateWorkoutMutation,
} from '../../../store';
import {
    WORKOUTS
} from '../../../Routes';
import { WorkoutType } from '../../../common/types';
import {
    ModalTemplate
} from '../../../common';
import { NavigationProp } from '@react-navigation/native';

type CreateWorkoutModalProps = {
    onExit: Function
    navigation: NavigationProp<any, any>
}

const CreateWorkoutModal = (props: CreateWorkoutModalProps) => {

    const [createWorkout, createWorkoutMutation] = useCreateWorkoutMutation();
    const [name, onChangeName] = useState('');

    useEffect(() => {
        if(createWorkoutMutation.data){
            const workout = createWorkoutMutation.data as WorkoutType
            props.navigation.navigate(WORKOUTS, {workout})
        }
    },  [
            createWorkoutMutation
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
                createWorkoutMutation.isLoading ? <ActivityIndicator size="large"/> : <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                /> 
            }
            <Button onClick={createWorkoutTemplate} text={'Create new template'}/>
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
