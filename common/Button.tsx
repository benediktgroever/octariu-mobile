import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { StyleType } from './types';

type ButtonProps = {
    onClick: Function,
    text: string,
    style?: StyleType,
    isLoading?: boolean,
}

const Button = (props: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, props.style]}
            onPress={() => props.onClick()}>
            {
                props.isLoading ? <ActivityIndicator /> : (
                    <Text style={styles.buttonText}>{props.text}</Text>
                )
            }
        </TouchableOpacity>
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
    },
    buttonText: {
        color: 'black'
    }
});

export { Button }