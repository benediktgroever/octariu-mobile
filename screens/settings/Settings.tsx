import { useState } from 'react';
import { Button, NavBar } from '../../common';
import {View, StyleSheet} from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

type SettingsScreenProps = {
    navigation: NavigationProp<any, any>;
}

const SettingsScreen = (props: SettingsScreenProps) => {

    const [isLoading, changeIsLoading] = useState(false);

    const handleLogout = () => {
        auth()
        .signOut()
        .then(() => console.log('User signed out!'));
        changeIsLoading(true);
    }

    return (
        <NavBar navigation={props.navigation}>
            <View style={styles.container}>
                <Button
                    text='Logout'
                    onClick={handleLogout}
                    isLoading={isLoading}
                />
            </View>
        </NavBar>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },
});

export { SettingsScreen }