import { useState } from 'react';
import { NavBar } from '../../common';
import {View, StyleSheet, Pressable, Image, Text} from 'react-native';
import {
    useCreateExerciseMutation,
    useListExercisesQuery,
} from '../../store';
import {
    ExerciseListItem
} from './ExerciseListItem';
import {
    ExerciseType
} from '../../common/types';
import {
  CreateExerciseModal
} from './CreateExerciseModal';

type ExercisesScreenProps = {
  navigation: any
}

const ExercisesScreen = (props: ExercisesScreenProps) => {

    const { data, error, isLoading } = useListExercisesQuery({hidden: false});
    const [createExercise] = useCreateExerciseMutation();
    const [showCreateExerciseModal, changeShowCreateExerciseModal] = useState(false)

    const onClickCreateNewExercise = () => {
        createExercise({name: 'New exercise'})
    }

    let exercises: ExerciseType[] | undefined = undefined;
    if(data){
        exercises = data.data
    }

    return (
        <NavBar 
            navigation={props.navigation}
            >
            <View style={styles.templateHeader}>
                <Text style={styles.header}>Exercises</Text>
                <Pressable 
                    style={styles.button}
                    onPress={() => changeShowCreateExerciseModal(!showCreateExerciseModal)}>
                    <Image 
                        source={require('../../assets/plus-button.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>
                        Add
                    </Text>
                </Pressable>
            </View>
            <View style={styles.centeredView}>
                {
                    exercises && exercises.map((exercise: ExerciseType) => {
                        return <ExerciseListItem key={exercise.exerciseId} exercise={exercise}/>
                    })
                }
            </View>
            {
              showCreateExerciseModal && <CreateExerciseModal onExit={() => changeShowCreateExerciseModal(false)} navigation={props.navigation}/>
            }
        </NavBar>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 20,
        height: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginRight: 20,
    },
    buttonText: {
        fontSize: 10,
    },
    templateHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    header: {
        fontSize: 20,
        margin: 10,
    },
    centeredView: {
      flex: 1,
      overflow: 'scroll'
    }
});

export { ExercisesScreen }