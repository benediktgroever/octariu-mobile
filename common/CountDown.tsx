import { View } from 'react-native';
import { RootState, useCountDownTimer } from '../store';
import { AnimatedProgressBar } from '../common';
import { useSelector } from 'react-redux';


const CountDown = () => {
    const { settings } = useSelector((state: RootState) => state.settings);
    const { minutes, seconds } = useCountDownTimer()
    if(settings.timerOn === undefined || settings.timerOn === false){
        return <View>
            <AnimatedProgressBar progress={0} text={""} />
        </View>
    }
    const remainingSeconds = minutes * 60 + seconds;
    const progress = remainingSeconds === 0 ? 0 : ( settings.timerInterval ? Number(remainingSeconds / settings.timerInterval) : 0);
    const content = remainingSeconds === 0 ? "" : `${minutes}m  ${seconds}s`;
    return (
        <View>
            <AnimatedProgressBar progress={progress} text={content} />
        </View>
    );
};

export { CountDown };
