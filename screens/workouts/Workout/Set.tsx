import { useState, useEffect } from 'react';
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
    SetType,
    WorkoutType
} from '../../../common/types';

type SetProps = {
    counter: number,
    set: SetType,
    workout: WorkoutType,
}

const Set = (props: SetProps) => {

    const previous = props.workout.template == false && props.workout.endTimeMs !== 0
    const [repCount, onChangeRepCount] = useState(Math.round(Number(props.set.repCount)).toString());
    const [weight, onChangeWeight] = useState((Math.round(Number(props.set.weight) * 10) / 10).toString());
    const [finished, onChangeFinished] = useState(props.set.completedAtMs !== 0);

    const [deleteSet] = useDeleteSetMutation();
    const [updateSet] = useUpdateSetMutation();

    const onChangeTextInputWeight = (text: string) => {
        if (text && text.slice(-1) !== '.' && text.indexOf(".") !== -1) {
            text = text.slice(0, text.indexOf(".") + 2)
        }
        onChangeWeight(text)
    }

    const submitEditingWeights = () => {
        updateSet({ setId: props.set.setId, weight: Number(Math.round(Number(weight) * 10) / 10) });
    }

    useEffect(() => {
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            const currentWeight = Number(Math.round(Number(weight) * 10) / 10);
            const updatedWeight = Number(Math.round(Number(props.set.weight) * 10) / 10);
            if (weight == "") {
                onChangeWeight(((Number(props.set.weight) * 10) / 10).toString())
            } else if (currentWeight != updatedWeight) {
                submitEditingWeights()
            }
            const currentReps = Math.round(Number(props.set.repCount))
            const updatedReps = Math.round(Number(repCount))
            if (repCount == "") {
                onChangeRepCount(Math.round(Number(props.set.repCount)).toString())
            } else if (currentReps != updatedReps) {
                submitEditingRepCount()
            }
        });
        return () => {
            hideSubscription.remove();
        };
    }, [weight, repCount]);

    const submitEditingRepCount = () => {
        updateSet({ setId: props.set.setId, repCount: Math.round(Number(repCount)) });
    }

    const toggleFinishSet = () => {
        if (finished) {
            updateSet({ setId: props.set.setId, completedAtMs: 0 });
            onChangeFinished(false);
        } else {
            updateSet({
                setId: props.set.setId,
                completedAtMs: previous ? props.workout.endTimeMs : Date.now()
            });
            onChangeFinished(true)
        }
    }

    const onClickDelete = () => {
        deleteSet({ setId: props.set.setId });
    }

    return (
        <View style={finished ? [styles.set, styles.finishedSet] : styles.set}>
            <Text style={styles.counter}> {props.counter} </Text>
            <Text style={styles.previous}> {"270x8"} </Text>
            <TextInput
                editable
                onChangeText={onChangeTextInputWeight}
                value={weight}
                style={styles.textInput}
                onPressIn={() => onChangeWeight("")}
                keyboardType="decimal-pad"
                autoComplete='off'
            />
            <TextInput
                editable
                onChangeText={onChangeRepCount}
                value={repCount}
                style={styles.textInput}
                onPressIn={() => onChangeRepCount("")}
                keyboardType="number-pad"
                autoComplete='off'
            />
            {
                !props.set.template && <Pressable
                    style={styles.button}
                    onPress={toggleFinishSet}>
                    {finished ? <Image
                        source={require('./../../../assets/checkFinished.png')}
                        style={{ width: 15, height: 15 }}
                    /> : <Image
                        source={require('./../../../assets/check.png')}
                        style={{ width: 15, height: 15 }}
                    />
                    }
                </Pressable>
            }
            <Pressable
                style={styles.button}
                onPress={onClickDelete}>
                <Image source={require('./../../../assets/trash-can.png')} style={{ width: 15, height: 15 }} />
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
        width: 50,
        paddingHorizontal: 5,
        paddingVertical: 2,
        backgroundColor: 'lightgrey',
        borderRadius: 4,
        textAlign: 'center',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
    },
    counter: {
        display: 'flex'
    },
    previous: {
        display: 'flex'
    }
});

export { Set }
