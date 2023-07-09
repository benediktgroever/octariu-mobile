import {View, Text, Modal, TextInput, StyleSheet, Pressable, Image, ActivityIndicator} from 'react-native';
import { Button } from '../../../common';
import { useState, useEffect } from 'react';
import {
    useCreateWorkoutMutation,
} from '../../../store';
import {
    WORKOUTS
} from '../../../Routes';
import { WorkoutType } from '../../../common/types';

type CreateWorkoutModalProps = {
    onExit: Function
    navigation: any
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
        <Modal
                transparent={true}
                visible={true}
            >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.button}>
                        <Pressable
                            onPress={() => props.onExit()}>
                            <Image
                                source={require('../../../assets/reject.png')}
                                style={styles.icon}
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.textStyle}>Your template's name</Text>
                    {
                        createWorkoutMutation.isLoading ? <ActivityIndicator size="large"/> : <TextInput
                            style={styles.input}
                            onChangeText={onChangeName}
                            value={name}
                        /> 
                    }
                    <Button onClick={createWorkoutTemplate} text={'Create new template'}/>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 25,
        height: 25,
    },
    button: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 15,
    },
    input: {
        width: '100%',
        backgroundColor: 'lightgrey',
        paddingVertical: 5,
        marginVertical: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 20,
      alignItems: 'center',
      width: "95%",
    },
    textStyle: {
      textAlign: 'left',
      width: '100%',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
});

export { CreateWorkoutModal }
