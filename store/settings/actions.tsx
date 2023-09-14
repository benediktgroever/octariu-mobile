import { store } from "..";
import { SettingsActionType } from "./types";
import {
    Vibration
} from 'react-native';
import notifee, { TimestampTrigger, TriggerType, AndroidImportance } from '@notifee/react-native';

const UNIQUE_RANDOM_NOTIFICATION_ID = 'some-random-id';

type paramsSetCountDownTime = {
    countDownEndTime: number,
    countDownSetId: string,
}

const createTimeOutNotification = async (countDownEndTime: number) => {

    // Request permissions (required for iOS)
    await notifee.requestPermission({ criticalAlert: true })

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'local.wav',
    });

    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: countDownEndTime
    };

    await notifee.createTriggerNotification(
        {
            id: UNIQUE_RANDOM_NOTIFICATION_ID,
            title: 'Your rest timer is up',
            body: 'Get back to work',
            android: {
                channelId,
                vibrationPattern: [300, 500],
            },
            ios: {
                critical: true,
                sound: 'local.wav',
            },
        },
        trigger,
    );
}

const cancelTimeOutNotification = async () => {
    await notifee.cancelNotification(UNIQUE_RANDOM_NOTIFICATION_ID);
}

const setCountDownTime = async (params: paramsSetCountDownTime) => {
    try {
        const stateCountDownEndTime = store.getState().settings.settings.countDownEndTime;
        if (stateCountDownEndTime === undefined) {
            // No count down defined, acquire count down lock
            store.dispatch({ type: SettingsActionType.UPDATE_COUNT_DOWN_TIMER, payload: { ...params } })
            if (params.countDownEndTime !== 0) {
                Vibration.vibrate();
                await createTimeOutNotification(params.countDownEndTime);
            }
        } else if (stateCountDownEndTime <= Date.now()) {
            // Count down expired allow new set to acquire count down timer lock
            store.dispatch({ type: SettingsActionType.UPDATE_COUNT_DOWN_TIMER, payload: { ...params } })
            if (params.countDownEndTime !== 0) {
                Vibration.vibrate();
                await createTimeOutNotification(params.countDownEndTime);
            }
        } else if (store.getState().settings.settings.countDownSetId === params.countDownSetId) {
            // Current set with count down lock wants to update count down time
            await cancelTimeOutNotification();
            store.dispatch({ type: SettingsActionType.UPDATE_COUNT_DOWN_TIMER, payload: { ...params } })
        }
    } catch (error) {
        console.error(error);
    }
};

export { setCountDownTime }