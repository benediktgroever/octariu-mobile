import {View, Text, Modal, TextInput, StyleSheet, Pressable, Image, ActivityIndicator} from 'react-native';
import { useState, useEffect } from 'react';
import {
    useCreateExerciseMutation,
} from '../../store';
import {
    EXERCISES
} from '../../Routes';
import { Button } from '../../common';

type CreateExerciseModalProps = {
    onExit: Function
    navigation: any
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
                                source={require('../../assets/reject.png')}
                                style={styles.icon}
                            />
                        </Pressable>
                    </View>
                    <Text style={styles.textStyle}>Exercise's name</Text>
                    {
                        createExerciseMutation.isLoading ? <ActivityIndicator size="large"/> : <TextInput
                            style={styles.input}
                            onChangeText={onChangeName}
                            value={name}
                        /> 
                    }
                    <Button onClick={onClickCreateExercise} text={'Create new exercise'}/>
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

export { CreateExerciseModal }
