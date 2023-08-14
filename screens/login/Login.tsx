import { View, StyleSheet, Text } from 'react-native';
import { SocialAuthSignIn } from './SocialAuthSignIn';


const LoginScreen = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Sterk</Text>
            <Text style={styles.subheader}>track for a better health</Text>
            <SocialAuthSignIn />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        margin: 10,
        fontSize: 25,
    },
    subheader: {
        margin: 10,
        fontSize: 20,
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export { LoginScreen }