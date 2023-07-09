import {View, Text, Modal, Pressable, StyleSheet} from 'react-native';
import {
    useListExercisesQuery,
} from '../../../store';
import {
    ExerciseType
} from '../../../common/types';

type ExercisePickerModalProps = {
    onClickCreateExercise: Function;
}

const ExercisePickerModal = (props: ExercisePickerModalProps) => {

    const {data, isLoading } = useListExercisesQuery({hidden: false});

    let exercises: ExerciseType[] | undefined = undefined;
    if(data){
        exercises = data.data
    }

    const renderedExercises = () => {
        return exercises && exercises.map(({name, exerciseId}: ExerciseType) => {
            return (
                <Pressable
                        key={exerciseId}
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => props.onClickCreateExercise(exerciseId)}>
                    <Text style={styles.textStyle}>{name}</Text>
                </Pressable>
            )
        })
    }

    return (
        <Modal
                transparent={true}
                visible={true}
            >
            <View style={styles.centeredView}>
                {
                    isLoading ? <View style={styles.modalView}>
                        <Text>Loading</Text>
                    </View> : <View style={styles.modalView}>
                        <Text>Which exercise do you want to add?</Text>
                        { renderedExercises() }
                    </View>
                }
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    },
    button: {
      borderRadius: 5,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
});

export { ExercisePickerModal }