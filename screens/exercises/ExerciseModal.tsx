import {Text, View, StyleSheet} from 'react-native';
import {
    ModalTemplate
} from '../../common';
import { ExerciseType } from '../../common/types';

type ExerciseModalProps = {
    onExit: Function
    exercise: ExerciseType,
}

const ExerciseModal = (props: ExerciseModalProps) => {

    return (
        <ModalTemplate onExit = {props.onExit}>
            <Text style={styles.title}>{props.exercise.name}</Text>
            <View style={styles.container}>
                <Text style={styles.heading}>Muscle group</Text>
                <Text style={styles.text}>{props.exercise.muscleGroup}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.heading}>Equipment needed</Text>
                <Text style={styles.text}>{props.exercise.equipment}</Text>
            </View>
            <Text style={styles.description}>Detailed description and pictures coming soon</Text>
        </ModalTemplate>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        paddingVertical: 10,
        width: '100%',
        textAlign: 'center'
    },
    container: {
        width: '100%',
        paddingVertical: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    heading: {
    },
    text: {
        fontWeight: '200',
    },
    description: {
        paddingVertical: 20,
        width: '100%',
        textAlign: 'center'
    }
});

export { ExerciseModal }
