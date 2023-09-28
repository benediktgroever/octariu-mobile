import CheckMark from './../../../assets/checked.svg';
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
    setCountDownTime,
    Set, Workout,
} from '../../../store';
import TrashCan from '../../../assets/trash-can.svg';

type SetProps = {
    counter: number,
    set: Set,
    workout: Workout,
    previousSet: Set | undefined,
}

const SetListItem = (props: SetProps) => {

    const previous = props.workout.template == false && props.workout.endTimeMs !== 0
    const [repCount, onChangeRepCount] = useState(Math.round(Number(props.set.repCount)).toString());
    const [weight, onChangeWeight] = useState((Math.round(Number(props.set.weight) * 10) / 10).toString());
    const [finished, onChangeFinished] = useState(props.set.completedAtMs !== 0);

    const { deleteSet } = useDeleteSetMutation();
    const { updateSet } = useUpdateSetMutation();

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
            if (!previous) {
                setCountDownTime({
                    cancel: true,
                    countDownSetId: props.set.setId
                })
            }
        } else {
            updateSet({
                setId: props.set.setId,
                completedAtMs: previous ? props.workout.endTimeMs : Date.now()
            });
            onChangeFinished(true)
            if (!previous) {
                setCountDownTime({
                    cancel: false,
                    countDownSetId: props.set.setId
                })
            }
        }
    }

    const onClickDelete = () => {
        deleteSet({ setId: props.set.setId });
    }

    return (
        <View style={finished ? [styles.set, styles.finishedSet] : styles.set}>
            <Text style={styles.counter}> {props.counter} </Text>
            <Text style={styles.previous}>
                {
                    props.previousSet ?
                        `${props.previousSet.weight} lbs x ${props.previousSet.repCount}` :
                        " - "
                }
            </Text>
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
                    <CheckMark
                        style={styles.controlIcon}
                        fill={finished ? '#00ba00' : 'black'}
                    />
                </Pressable>
            }
            <Pressable
                style={styles.button}
                onPress={onClickDelete}>
                <TrashCan style={styles.icon} fill={'rgb(200,0,0)'} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    finishedSet: {
        backgroundColor: 'rgb(230, 255, 230)',
    },
    icon: {
        width: 16,
        height: 16,
    },
    set: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        border: 5,
        borderColor: 'black',
        margin: 2,
        flexGrow: 1,
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
    controlIcon: {
        width: 15,
        height: 15,
        padding: 8,
    },
    previous: {
        display: 'flex',
        width: 90,
        textAlign: 'center',
    }
});

export { SetListItem }
