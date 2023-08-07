import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../..';


const useCountDownTimer = () => {

    const { settings } = useSelector((state: RootState) => state.settings);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const getTime = (countDownEndTime: number) => {
        const time = countDownEndTime - Date.now();
        if (time >= 0) {
            setMinutes(Math.floor((time / 1000 / 60) % 60));
            setSeconds(Math.floor((time / 1000) % 60));
        } else {
            setMinutes(0)
            setSeconds(0)
        }
    };

    useEffect(() => {
        getTime(settings.countDownEndTime ? settings.countDownEndTime : 0)
        const interval = setInterval(() => getTime(settings.countDownEndTime ? settings.countDownEndTime : 0), 1000);
        return () => clearInterval(interval);
    }, [settings]);

    return {
        seconds,
        minutes,
    }
};


export { useCountDownTimer };