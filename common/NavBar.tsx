import Workouts from "../assets/to-do-list.svg";
import Clock from "../assets/clock.svg";
import Weights from "../assets/dumbbell.svg";
import Settings from "../assets/settings.svg";
import { ReactNode } from 'react';
import {
    CountDown
} from './CountDown';
import {
    View,
    StyleSheet,
    Pressable,
    Text
} from 'react-native';
import {
    WORKOUTS,
    HISTORY,
    SETTINGS,
    EXERCISES,
} from '../Routes';
import { useRoute } from '@react-navigation/native';
import { BACKGROUND_COLOR } from './constants';
import { useListWorkoutsQuery } from "../store";

type NavBarProps = {
    navigation: any
    children: ReactNode
}

const FOREGROUND_COLOR = '#5e5d5c'

function NavBar(props: NavBarProps) {
    const route = useRoute();
    const { workouts } = useListWorkoutsQuery({});

    const workoutFill = WORKOUTS === route.name ?
        FOREGROUND_COLOR : BACKGROUND_COLOR;
    const historyFill = HISTORY === route.name ?
        FOREGROUND_COLOR : BACKGROUND_COLOR;
    const exercisesFill = EXERCISES === route.name ?
        FOREGROUND_COLOR : BACKGROUND_COLOR;
    const settingsFill = SETTINGS === route.name ?
        FOREGROUND_COLOR : BACKGROUND_COLOR;

    return (
        <View style={styles.container}>
            <CountDown />
            <View style={styles.content}>
                {props.children}
            </View>
            <View style={styles.navBar}>
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(WORKOUTS)}>
                    <Workouts width={23} height={23} fill={workoutFill} style={styles.icon} />
                    <Text style={[styles.buttonText, { color: workoutFill }]}>
                        Workouts
                    </Text>
                    {
                        workouts.length !== 0 && <View style={styles.workoutCountContainer}>
                            <Text style={styles.workoutCountText}>{workouts.length}</Text>
                        </View>

                    }
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(HISTORY)}>
                    <Clock width={23} height={23} fill={historyFill} style={styles.icon} />
                    <Text style={[styles.buttonText, { color: historyFill }]}>
                        History
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(EXERCISES)}>
                    <Weights width={23} height={23} fill={exercisesFill} style={styles.icon} />
                    <Text style={[styles.buttonText, { color: exercisesFill }]}>
                        Exercises
                    </Text>
                </Pressable>
                {/* <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(SETTINGS)}>
                    <Settings width={23} height={23} fill={settingsFill} style={styles.icon} />
                    <Text style={[styles.buttonText, { color: settingsFill }]}>
                        Social
                    </Text>
                </Pressable> */}
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(SETTINGS)}>
                    <Settings width={23} height={23} fill={settingsFill} style={styles.icon} />
                    <Text style={[styles.buttonText, { color: settingsFill }]}>
                        Settings
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    workoutCountContainer: {
        color: 'black',
        position: 'absolute',
        backgroundColor: 'lightblue',
        borderRadius: 8,
        padding: 1,
        height: 15,
        width: 28,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        top: -5,
        right: 0,
    },
    workoutCountText: {
        color: 'black',
        fontSize: 10,
        alignItems: 'center',
    },
    icon: {
        margin: 3,
        width: 23,
        height: 23,
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 12,
        color: BACKGROUND_COLOR,
    },
    container: {
        display: 'flex',
        flex: 1
    },
    content: {
        flex: 1,
        display: 'flex',
        backgroundColor: BACKGROUND_COLOR,
    },
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1f1d1a',
        padding: 5,
        paddingTop: 10,
    }
});

export { NavBar };