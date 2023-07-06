import React from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';
import { ActivityIndicator } from 'react-native';

type ButtonProps = {
    onClick: Function,
    text: string,
    isLoading: boolean,
}

const Button = (props: ButtonProps) => {
    return (
        <Pressable 
            style={styles.button}
            onPress={() => props.onClick()}>
            {
                props.isLoading ? <ActivityIndicator/> : (
                    <Text style={styles.buttonText}>{props.text}</Text>
                )
            }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 5,
        marginVertical: 8,
        backgroundColor: 'lightgrey',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
    },
    buttonText: {
        color: 'black'
    }
});

export { Button }