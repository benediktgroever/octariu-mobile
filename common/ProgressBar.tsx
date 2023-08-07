import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Text } from 'react-native';

interface AnimatedProgressBarProps {
    progress: number,
    text: string,
}

const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({ text, progress }) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 0,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    const widthStyle = {
        width: animatedWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
        })
    };

    return (
        <React.Fragment>
            <View style={styles.container}>
                <Animated.View style={[styles.progressBar, widthStyle]}></Animated.View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>{text}</Text>
                </View>
            </View>
        </React.Fragment>
    )

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 20,
        backgroundColor: '#E0E0E0',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2b2e2b',
    },
    textContainer: {
        height: 20,
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    text: {
        color: 'red',
        backgroundColor: 'rgba(0,0,0,0)',
    }
})

export {
    AnimatedProgressBar
}