import { ReactNode } from 'react';

import {
    CountDown
} from './CountDown';

import {
    View,
    StyleSheet,
    Pressable,
    Image,
    Text
} from 'react-native';

import {
    WORKOUTS,
    HISTORY,
    SETTINGS,
    EXERCISES,
} from '../Routes';

type NavBarProps = {
    navigation: any
    children: ReactNode
}

function NavBar(props: NavBarProps) {

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
                    <Image
                        source={require('../assets/workout.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>
                        Workouts
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(HISTORY)}>
                    <Image
                        source={require('../assets/clock.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>
                        History
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(EXERCISES)}>
                    <Image
                        source={require('../assets/dumbbell.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>
                        Exercises
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => props.navigation.navigate(SETTINGS)}>
                    <Image
                        source={require('../assets/settings.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.buttonText}>
                        Settings
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
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
    },
    container: {
        display: 'flex',
        flex: 1
    },
    content: {
        flex: 1,
        display: 'flex',
        backgroundColor: 'white',
    },
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: 'lightgrey',
        padding: 5,
        paddingTop: 10,
    }
});

export { NavBar };