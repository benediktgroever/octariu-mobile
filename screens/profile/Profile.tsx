import { useState } from 'react';
import { Button, Dropdown, NavBar } from '../../common';
import { View, StyleSheet, Image, Text, Switch } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import { FOREGROUND_COLOR } from '../../common/constants'
import { useListSettingsQuery,  } from '../../store';

type ProfileScreenProps = {
    navigation: NavigationProp<any, any>;
}


const DEFAULT_TIMERS = new Map();
DEFAULT_TIMERS.set('30 s', 30)
DEFAULT_TIMERS.set('1 min', 60)
DEFAULT_TIMERS.set('1 min 30s', 90)
DEFAULT_TIMERS.set('2 min', 120)
DEFAULT_TIMERS.set('2 min 30s', 150)
DEFAULT_TIMERS.set('3 min', 180)
DEFAULT_TIMERS.set('5 min', 300)

const ProfileScreen = (props: ProfileScreenProps) => {

    const [isLoading, changeIsLoading] = useState(false);
    const { settings, updateSettings } = useListSettingsQuery();

    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        changeIsLoading(true);
    }

    const toggleRestTimer = async () => {
        if(settings.timerOn){
            await updateSettings({timerOn: 0})
        }else{
            await updateSettings({timerOn: 1})
        }
    }

    const changeRestTimer = async (item: string) => {
        await updateSettings({timerInterval: DEFAULT_TIMERS.get(item) });
    }

    let defaultValue: string = '30 s';
    DEFAULT_TIMERS.forEach((value, key) => {
        if (value === settings.timerInterval) {
            defaultValue = key;
        }
    });

    return (
        <NavBar navigation={props.navigation}>
            <View style={styles.container}>
                <View style={styles.settingsElement}>
                    <View>
                        {
                            settings.photoURL && 
                                <Image style={styles.profile} source={{uri: settings.photoURL}}/>
                        }
                    </View>
                    <View style={styles.settingsName}>
                        <Text style={styles.name}>
                            {settings.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.settingsElement}>
                    <View  style={styles.nameContainer}>
                        <Text style={styles.name}>
                            Rest timer On/Off
                        </Text>
                    </View>
                    <Switch
                        trackColor={{false: 'lightgrey', true: 'lightgrey'}}
                        thumbColor={settings.timerOn ? 'grey' : 'grey'}
                        ios_backgroundColor={'lightgrey'}
                        onValueChange={toggleRestTimer}
                        value={settings.timerOn}
                    />
                </View>
                <View style={styles.settingsElement}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                            Rest timer 
                        </Text>
                    </View>
                    <Dropdown
                        default={defaultValue}
                        data={Array.from(DEFAULT_TIMERS.keys())}
                        onSelect={changeRestTimer}
                    />
                </View>
                <Button
                    text='Logout'
                    onClick={handleLogout}
                    isLoading={isLoading}
                    style={styles.button}
                />
            </View>
        </NavBar>
    );
};

const styles = StyleSheet.create({
    settingsElement: {
        width: '95%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    settingsName: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        flex: 1,
    },
    profile: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: FOREGROUND_COLOR,
    },
    name: {
        fontSize: 20,
    },
    nameContainer: {
        display: 'flex',
        justifyContent: 'center'
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },
    button: {
        width: '95%',
        padding: 5,
        backgroundColor: FOREGROUND_COLOR,
        height: 50,
        zIndex: -1,
    }
});

export { ProfileScreen }