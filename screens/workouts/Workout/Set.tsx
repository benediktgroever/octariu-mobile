import { useState } from 'react';
import {
    Keyboard,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Image
} from 'react-native';
import {
    useUpdateSetMutation,
    useDeleteSetMutation,
} from '../../../store';
import {
    SetType
} from '../../../common/types';

type SetProps = {
    counter: number,
    set: SetType,
}

const Set = (props: SetProps) => {

    const [reps, onChangeReps] = useState(props.set.reps);
    const [weight, onChangeWeight] = useState(props.set.weight);
    const [finished, onChangeFinished] = useState(props.set.date !== 0);

    const [deleteSet] = useDeleteSetMutation();
    const [updateSet] = useUpdateSetMutation();

    const submitEditingWeights = () => {
        updateSet({setId: props.set.setId, weight: weight});
        Keyboard.dismiss();
    }

    const submitEditingReps = () => {
        updateSet({setId: props.set.setId, reps: reps});
        Keyboard.dismiss();
    }

    const toggleFinishSet = () => {
        if(finished){
            updateSet({setId: props.set.setId, date: 0});
            onChangeFinished(false);
        }else{
            updateSet({setId: props.set.setId, date: Date.now()});
            onChangeFinished(true)
        }
    }

    const onClickDelete = () => {
        deleteSet({setId: props.set.setId});
    }

    return (
        <View style={finished ? [styles.set, styles.finishedSet] : styles.set}>
            <Text style={styles.counter}> { props.counter } </Text>
            <Text style={styles.previous}> { "270x8"} </Text>
            <TextInput
                editable
                onChangeText={text => onChangeWeight(Number(text.replace(/[^0-9]/g, '')))}
                onSubmitEditing={submitEditingWeights}
                value={weight.toString()}
                style={styles.textInput}
            />
            <TextInput
                editable
                onChangeText={text => onChangeReps(Number(text.replace(/[^0-9]/g, '')))}
                onSubmitEditing={submitEditingReps}
                value={reps.toString()}
                style={styles.textInput}
            />
            {
                !props.set.template && <Pressable 
                    style={styles.button}
                    onPress={toggleFinishSet}>
                    { finished ? <Image 
                            source={require('./../../../assets/checkFinished.png')} 
                            style={{width: 15, height: 15}}
                        /> : <Image 
                            source={require('./../../../assets/check.png')} 
                            style={{width: 15, height: 15}} 
                        /> 
                    }
                </Pressable>
            }
            <Pressable 
                style={styles.button}
                onPress={onClickDelete}>
                <Image source={require('./../../../assets/trash-can.png')} style={{width: 15, height: 15}} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    finishedSet: {
        backgroundColor: 'rgb(185, 255, 185)',
    },
    set: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        border: 5,
        borderColor: 'black',
        margin: 2,
    },
    textInput: {
        width: 30,
        margin: 2,
        backgroundColor: 'lightgrey',
        borderRadius: 4,
        textAlign: 'center',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        margin: 2
    },
    counter: {
        display: 'flex'
    },
    previous: {
        display: 'flex'
    }
});

export { Set }
