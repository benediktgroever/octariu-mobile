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
    Text,
    Image,
} from 'react-native';
import {
    WORKOUTS,
    HISTORY,
    SETTINGS,
    EXERCISES,
} from '../Routes';
import { useRoute } from '@react-navigation/native';
import { BACKGROUND_COLOR, NAVBAR_COLOR, NAVBAR_FOREGROUND_COLOR } from './constants';
import { useListWorkoutsQuery, useListSettingsQuery } from "../store";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type NavBarProps = {
    navigation: any
    children: ReactNode
}


function NavBar(props: NavBarProps) {
    const route = useRoute();
    const { workoutsPerformed } = useListWorkoutsQuery({doNotFetch: true});
    const { settings } = useListSettingsQuery();

    const workoutFill = WORKOUTS === route.name ?
        BACKGROUND_COLOR : NAVBAR_FOREGROUND_COLOR;
    const historyFill = HISTORY === route.name ?
        BACKGROUND_COLOR : NAVBAR_FOREGROUND_COLOR;
    const exercisesFill = EXERCISES === route.name ?
        BACKGROUND_COLOR : NAVBAR_FOREGROUND_COLOR;
    const profileFill = SETTINGS === route.name ?
        BACKGROUND_COLOR : NAVBAR_FOREGROUND_COLOR;

    return (
        <GestureHandlerRootView style={styles.container}>
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
                        workoutsPerformed.length !== 0 && <View style={styles.workoutCountContainer}>
                            <Text style={styles.workoutCountText}>{workoutsPerformed.length}</Text>
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
                    {
                        settings.photoURL ?
                            <Image style={[styles.profile, {'borderColor': profileFill}]} source={{uri: settings.photoURL}}/> :
                            <Settings width={23} height={23} fill={profileFill} style={styles.icon} />
                    }
                    <Text style={[styles.buttonText, { color: profileFill }]}>
                        Profile
                    </Text>
                </Pressable>
            </View>
        </GestureHandlerRootView>
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
    profile: {
        borderRadius: 28,
        width: 28,
        height: 28,
        borderWidth: 2,
    },
    button: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
    },
    buttonText: {
        fontSize: 12,
        color: BACKGROUND_COLOR,
    },
    container: {
        height: "100%",
        width: "100%",
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
        backgroundColor: NAVBAR_COLOR,
        padding: 5,
        paddingTop: 10,
    }
});

export { NavBar };