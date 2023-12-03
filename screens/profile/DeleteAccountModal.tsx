import { Text, StyleSheet } from 'react-native';
import { Button } from '../../common';
import {
    ModalTemplate
} from '../../common';
import { NavigationProp } from '@react-navigation/native';
import { useState } from 'react';

type DeleteWorkoutModalProps = {
    onExit: Function
    onDeleteAccount: Function
    navigation: NavigationProp<any, any>
}

const DeleteAccountModal = (props: DeleteWorkoutModalProps) => {

    const [isLoading, changeIsLoading] = useState(false);

    const onExit = () => {
        if(isLoading){
            return;
        }
        props.onExit();
    }

    const onDeleteAccount = async () => {
        if(isLoading){
            return;
        }
        changeIsLoading(true);
        await props.onDeleteAccount();
        changeIsLoading(false);
    }


    return (
        <ModalTemplate onExit={onExit}>
            <Text style={styles.textStyleHeader}>Do you want to delete this account? </Text>
            <Text style={styles.textStyle}>This action will delete all data which can't be undone.</Text>
            <Button 
                onClick={onDeleteAccount} 
                style={{margin: 10, padding: 10, marginVertical: 20, width: '100%'}} 
                text={'Delete account'}
                isLoading={isLoading}
            />
        </ModalTemplate>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        backgroundColor: 'lightgrey',
        paddingVertical: 5,
        marginVertical: 10,
    },
    textStyle: {
        textAlign: 'center',
        width: '100%',
        fontWeight: "300",
        paddingVertical: 10,
    },
    textStyleHeader: {
        textAlign: 'center',
        width: '100%',
        color: 'red',
        paddingVertical: 30,
    },
});

export { DeleteAccountModal }
