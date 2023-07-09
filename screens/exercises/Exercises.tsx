import { useState } from 'react';
import { NavBar } from '../../common';
import {View, StyleSheet, Pressable, Image, Text, FlatList} from 'react-native';
import {
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
import { NavigationProp } from '@react-navigation/native';

type ExercisesScreenProps = {
  navigation: NavigationProp<any, any>
}

const ExercisesScreen = (props: ExercisesScreenProps) => {

    const { data } = useListExercisesQuery({hidden: false});
    const [showCreateExerciseModal, changeShowCreateExerciseModal] = useState(false)

    let exercises: ExerciseType[] | undefined = undefined;
    if(data){
        exercises = data.data
    }

    const renderExercise = ({item}: {item: ExerciseType}) => {
        return <Text style={styles.exerciseItem} key={item.exerciseId}>{item.name}</Text>
        // return <ExerciseListItem key={item.exerciseId} exercise={item}/>
    }

    return (
        <NavBar 
            navigation={props.navigation}
            >
            <View style={styles.container}>
                <View style={styles.templateHeader}>
                    <Text style={styles.header}>Exercises</Text>
                    {/* <Pressable 
                        style={styles.button}
                        onPress={() => changeShowCreateExerciseModal(!showCreateExerciseModal)}>
                        <Image 
                            source={require('../../assets/plus-button.png')}
                            style={styles.icon}
                        />
                        <Text style={styles.buttonText}>
                            Add
                        </Text>
                    </Pressable> */}
                </View>
                <FlatList
                    data={exercises}
                    renderItem={renderExercise}
                    keyExtractor={exercise => exercise.exerciseId}
                    style={styles.flatlist}
                />
                {
                    showCreateExerciseModal && <CreateExerciseModal onExit={() => changeShowCreateExerciseModal(false)} navigation={props.navigation}/>
                }
            </View>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    flatlist: {
        display: 'flex',
        width: '95%',
    },
    exerciseItem: {
        paddingVertical: 5,
        marginVertical: 5,
        backgroundColor: 'lightgrey',
    },
    container: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
    }
});

export { ExercisesScreen }