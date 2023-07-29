import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TimerProps = {
  startTime: number
}

const Timer = (props: TimerProps) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTime = () => {
    const time = Date.now() - props.startTime;
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    getTime()
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Text style={styles.text}>
        {hours}h {minutes}m {seconds}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'red'
  },
});

export { Timer };