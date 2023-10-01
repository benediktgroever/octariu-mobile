import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { StyleType } from './types';
import { BUTTON_COLOR, FOREGROUND_COLOR } from './constants';

type ButtonProps = {
    onClick: Function,
    text: string,
    style?: StyleType,
    isLoading?: boolean,
    backgroundColor?: string,
}

const Button = (props: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[styles.button, props.style, {backgroundColor: props.backgroundColor ? props.backgroundColor : FOREGROUND_COLOR}]}
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
        backgroundColor: BUTTON_COLOR,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 1,
        shadowOffset: {
          height: 1,
          width: 1
        }
    },
    buttonText: {
        color: 'black'
    }
});

export { Button }