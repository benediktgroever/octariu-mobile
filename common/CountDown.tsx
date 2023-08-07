import { View } from 'react-native';
import { useCountDownTimer } from '../store';
import { AnimatedProgressBar } from '../common';


const CountDown = () => {
    const { minutes, seconds } = useCountDownTimer()
    const remainingSeconds = minutes * 60 + seconds;
    const progress = remainingSeconds === 0 ? 0 : Number(remainingSeconds / 120);
    const content = remainingSeconds === 0 ? "" : `${minutes}m  ${seconds}s`;
    return (
        <View>
            <AnimatedProgressBar progress={progress} text={content} />
        </View>
    );
};

export { CountDown };
